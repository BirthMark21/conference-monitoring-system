import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Card, Button, Modal, Form, Alert, ButtonGroup } from "react-bootstrap";
import { FaEye, FaPen, FaTrash, FaSave, FaThLarge, FaThList, FaCalendarAlt, FaTag, FaDownload } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Contents = () => {
  const [contents, setContents] = useState([]);
  const [events, setEvents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [newContent, setNewContent] = useState({
    contents_events: "",
    title: "",
    description: "",
    tag: "",
    reference_urls: "",
    content_type: "PDF",
    rating: "",
    image: null,
    document: null,
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [viewMode, setViewMode] = useState("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    fetchContents();
    fetchEvents();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/content/");
      setContents(response.data);
    } catch (error) {
      console.error("Error fetching contents:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/physical-events/");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleAddContent = async () => {
    try {
      const formData = new FormData();
      for (const key in newContent) {
        formData.append(key, newContent[key]);
      }

      const response = await axios.post("http://127.0.0.1:8000/api/content/", formData);

      if (response.status === 201) {
        fetchContents();
        setShowAddModal(false);
        showAlert("Content added successfully!", "success");
      } else {
        console.error("Error adding content:", response.status);
        showAlert("Error adding content", "danger");
      }
    } catch (error) {
      console.error("Error adding content:", error);
      showAlert("Error adding content", "danger");
    }
  };

  const handleDeleteContent = async (contentId) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/api/content/${contentId}/`);
      if (response.status === 204) {
        fetchContents();
        showAlert("Content deleted successfully!", "success");
      } else {
        console.error("Error deleting content:", response.status);
        showAlert("Error deleting content", "danger");
      }
    } catch (error) {
      console.error("Error deleting content:", error);
      showAlert("Error deleting content", "danger");
    }
  };

  const handleUpdateContent = (content) => {
    setSelectedContent(content);
    setNewContent({
      ...content,
      rating: content.rating || "",
    });
    setShowUpdateModal(true);
  };

  const handleDetailView = (content) => {
    setSelectedContent(content);
    setShowDetailModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewContent((prevContent) => ({
      ...prevContent,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewContent((prevContent) => ({
        ...prevContent,
        [e.target.name]: file,
      }));
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      const formData = new FormData();
      for (const key in newContent) {
        formData.append(key, newContent[key]);
      }

      const response = await axios.put(`http://127.0.0.1:8000/api/content/${newContent.id}/`, formData);

      if (response.status === 200) {
        fetchContents();
        setShowUpdateModal(false);
        showAlert("Content updated successfully!", "success");
      } else {
        console.error("Error updating content:", response.status);
        showAlert("Error updating content", "danger");
      }
    } catch (error) {
      console.error("Error updating content:", error);
      showAlert("Error updating content", "danger");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  const filteredContents = contents.filter((content) =>
    (content.title || "").toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!filterType || content.content_type === filterType)
  );

  const getCountByType = (type) => contents.filter(content => content.content_type === type).length;

  const showAlert = (message, variant) => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setTimeout(() => {
      setAlertMessage("");
    }, 3000);
  };

  return (
    <div>
      {alertMessage && (
        <Alert variant={alertVariant} className="text-center">
          {alertMessage}
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Control
          type="text"
          placeholder="Search Contents..."
          value={searchQuery}
          onChange={handleSearch}
          className="me-2"
        />
        <Form.Control
          as="select"
          value={filterType}
          onChange={handleFilterChange}
          className="me-2"
        >
          <option value="">All Types ({contents.length})</option>
          <option value="PDF">PDF Document ({getCountByType("PDF")})</option>
          <option value="PPT">PowerPoint Presentation ({getCountByType("PPT")})</option>
          <option value="MP3">MP3 Audio ({getCountByType("MP3")})</option>
          <option value="MP4">MP4 Video ({getCountByType("MP4")})</option>
          <option value="DOC">Word Document ({getCountByType("DOC")})</option>
          <option value="TXT">Text File ({getCountByType("TXT")})</option>
          <option value="IMG">Image ({getCountByType("IMG")})</option>
        </Form.Control>
        <Button className=" bg-dark" >
            <a href="/videos" >View Content</a>
          </Button>
        <ButtonGroup>
          <Button variant="outline-primary" onClick={() => setViewMode("card")}>
            <FaThLarge /> Card View
          </Button>
          <Button variant="outline-primary" onClick={() => setViewMode("table")}>
            <FaThList /> Table View
          </Button>
        
          
        </ButtonGroup>
      </div>

      <Button variant="primary" onClick={() => setShowAddModal(true)} className="mb-3">
        <FaSave /> Add Content
      </Button>

      {viewMode === "table" ? (
        <div style={{ overflowX: "auto" }}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Tag</th>
                <th>Reference URLs</th>
                <th>Content Type</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContents.map((content) => (
                <tr key={content.id}>
                  <td>{content.title}</td>
                  <td>{content.description}</td>
                  <td>{content.tag}</td>
                  <td>
                    {content.reference_urls.split(",").map((url, idx) => (
                      <div key={idx}>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                          {url}
                        </a>
                      </div>
                    ))}
                  </td>
                  <td>{content.content_type}</td>
                  <td>{content.rating}</td>
                  <td>
                    <ButtonGroup>
                      <Button variant="outline-primary" onClick={() => handleDetailView(content)}>
                        <FaEye />
                      </Button>
                      <Button variant="outline-secondary" onClick={() => handleUpdateContent(content)}>
                        <FaPen />
                      </Button>
                      <Button variant="outline-danger" onClick={() => handleDeleteContent(content.id)}>
                        <FaTrash />
                      </Button>
                      {content.document && (
                        <Button variant="outline-success" href={content.document} download>
                          <FaDownload />
                        </Button>
                      )}
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <div className="d-flex flex-wrap">
          {filteredContents.map((content) => (
            <Card key={content.id} className="m-2" style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title>{content.title}</Card.Title>
                {content.image && <Card.Img variant="top" src={content.image} alt="Content Image" className="mt-2" />}
                
                {content.reference_urls.split(",").map((url, idx) => (
                  <div key={idx}>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {url}
                    </a>
                  </div>
                ))}
                <ButtonGroup className="mt-2">
                  <Button variant="outline-primary" onClick={() => handleDetailView(content)}>
                    <FaEye />
                  </Button>
                  <Button variant="outline-secondary" onClick={() => handleUpdateContent(content)}>
                    <FaPen />
                  </Button>
                  <Button variant="outline-danger" onClick={() => handleDeleteContent(content.id)}>
                    <FaTrash />
                  </Button>
                  {content.document && (
                    <Button variant="outline-success" href={content.document} download>
                      <FaDownload />
                    </Button>
                  )}
                </ButtonGroup>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {/* Add Content Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Content</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="contents_events">
              <Form.Label>Content Event</Form.Label>
              <Form.Control
                as="select"
                name="contents_events"
                value={newContent.contents_events}
                onChange={handleChange}
              >
                <option value="">Select an Event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newContent.title}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={newContent.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="tag">
              <Form.Label>Tag</Form.Label>
              <Form.Control
                type="text"
                name="tag"
                value={newContent.tag}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="reference_urls">
              <Form.Label>Reference URLs (comma separated)</Form.Label>
              <Form.Control
                type="text"
                name="reference_urls"
                value={newContent.reference_urls}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="content_type">
              <Form.Label>Content Type</Form.Label>
              <Form.Control
                as="select"
                name="content_type"
                value={newContent.content_type}
                onChange={handleChange}
              >
                <option value="PDF">PDF Document</option>
                <option value="PPT">PowerPoint Presentation</option>
                <option value="MP3">MP3 Audio</option>
                <option value="MP4">MP4 Video</option>
                <option value="DOC">Word Document</option>
                <option value="TXT">Text File</option>
                <option value="IMG">Image</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="rating">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="text"
                name="rating"
                value={newContent.rating}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleFileChange}
              />
            </Form.Group>
            <Form.Group controlId="document">
              <Form.Label>Document</Form.Label>
              <Form.Control
                type="file"
                name="document"
                onChange={handleFileChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddContent}>
            Add Content
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Content Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Content</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="contents_events">
              <Form.Label>Content Event</Form.Label>
              <Form.Control
                as="select"
                name="contents_events"
                value={newContent.contents_events}
                onChange={handleChange}
              >
                <option value="">Select an Event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newContent.title}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={newContent.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="tag">
              <Form.Label>Tag</Form.Label>
              <Form.Control
                type="text"
                name="tag"
                value={newContent.tag}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="reference_urls">
              <Form.Label>Reference URLs (comma separated)</Form.Label>
              <Form.Control
                type="text"
                name="reference_urls"
                value={newContent.reference_urls}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="content_type">
              <Form.Label>Content Type</Form.Label>
              <Form.Control
                as="select"
                name="content_type"
                value={newContent.content_type}
                onChange={handleChange}
              >
                <option value="PDF">PDF Document</option>
                <option value="PPT">PowerPoint Presentation</option>
                <option value="MP3">MP3 Audio</option>
                <option value="MP4">MP4 Video</option>
                <option value="DOC">Word Document</option>
                <option value="TXT">Text File</option>
                <option value="IMG">Image</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="rating">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="text"
                name="rating"
                value={newContent.rating}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleFileChange}
              />
            </Form.Group>
            <Form.Group controlId="document">
              <Form.Label>Document</Form.Label>
              <Form.Control
                type="file"
                name="document"
                onChange={handleFileChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateSubmit}>
            Update Content
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Detail View Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Content Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedContent && (
            <>
              <p><strong>Event:</strong> {selectedContent.contents_events}</p>
              <p><strong>Title:</strong> {selectedContent.title}</p>
              <p><strong>Description:</strong> {selectedContent.description}</p>
              <p><strong>Tag:</strong> {selectedContent.tag}</p>
              <p><strong>Reference URLs:</strong></p>
              <ul>
                {selectedContent.reference_urls.split(",").map((url, idx) => (
                  <li key={idx}>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
              <p><strong>Rating:</strong> {selectedContent.rating}</p>
              {selectedContent.image && (
                <div>
                  <p><strong>Image:</strong></p>
                  <img
                    src={selectedContent.image}
                    alt="Content"
                    style={{ width: "100%", height: "auto" }}
                  />
                </div>
              )}
              {selectedContent.document && (
                <div>
                  <p><strong>Document:</strong></p>
                  <a href={selectedContent.document} download>
                    {selectedContent.document}
                  </a>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Contents;
