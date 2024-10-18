import React, { useState, useEffect } from "react";
import { Table, Card, Button, Modal, Form, Alert, ButtonGroup, Dropdown } from "react-bootstrap";
import { FaSave, FaPen, FaTrash, FaThList, FaThLarge, FaAlignLeft, FaSortNumericDown, FaFileDownload, FaEye, FaTags, FaFileAlt } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Paper = () => {
  const [abstractItems, setAbstractItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItem, setNewItem] = useState({
    author: "",
    title: "",
    content_text: "",
    status: "submitted",
    document: null,
    abstract_image: null,
    content_type: "txt",
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [viewMode, setViewMode] = useState("card");

  useEffect(() => {
    fetchAbstractItems();
  }, []);

  const fetchAbstractItems = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/abstracts/");
      if (response.ok) {
        const data = await response.json();
        setAbstractItems(data);
        setFilteredItems(data);
      } else {
        console.error("Error fetching abstract items:", response.status);
      }
    } catch (error) {
      console.error("Error fetching abstract items:", error);
    }
  };

  const getStatusCounts = () => {
    const statusCounts = abstractItems.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
    return statusCounts;
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    if (status) {
      setFilteredItems(abstractItems.filter(item => item.status === status));
    } else {
      setFilteredItems(abstractItems);
    }
  };

  const handleAddItem = async () => {
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      for (const key in newItem) {
        formData.append(key, newItem[key]);
      }

      const response = await fetch("http://127.0.0.1:8000/api/abstracts/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        fetchAbstractItems();
        setShowAddModal(false);
        showAlert("Abstract added successfully!", "success");
      } else {
        console.error("Error adding abstract:", response.status);
        showAlert("Error adding abstract", "danger");
      }
    } catch (error) {
      console.error("Error adding abstract:", error);
      showAlert("Error adding abstract", "danger");
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/abstracts/${itemId}/`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchAbstractItems();
        showAlert("Abstract deleted successfully!", "success");
      } else {
        console.error("Error deleting abstract:", response.status);
        showAlert("Error deleting abstract", "danger");
      }
    } catch (error) {
      console.error("Error deleting abstract:", error);
      showAlert("Error deleting abstract", "danger");
    }
  };

  const handleUpdateItem = (item) => {
    setSelectedItem(item);
    setNewItem({
      ...item,
      author: item.author || "",
      title: item.title || "",
      content_text: item.content_text || "",
      status: item.status || "submitted",
      document: item.document || null,
      abstract_image: item.abstract_image || null,
      content_type: item.content_type || "txt",
    });
    setShowUpdateModal(true);
  };

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewItem((prevItem) => ({
        ...prevItem,
        [e.target.name]: file,
      }));
    }
  };

  const handleUpdateSubmit = async () => {
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      for (const key in newItem) {
        formData.append(key, newItem[key]);
      }

      const response = await fetch(`http://127.0.0.1:8000/api/abstracts/${newItem.id}/`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        fetchAbstractItems();
        setShowUpdateModal(false);
        showAlert("Abstract updated successfully!", "success");
      } else {
        console.error("Error updating abstract:", response.status);
        showAlert("Error updating abstract", "danger");
      }
    } catch (error) {
      console.error("Error updating abstract:", error);
      showAlert("Error updating abstract", "danger");
    }
  };

  const showAlert = (message, variant) => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setTimeout(() => {
      setAlertMessage("");
    }, 3000);
  };

  const validateForm = () => {
    if (!newItem.author || !newItem.title || !newItem.status) {
      showAlert("Please fill in all required fields", "danger");
      return false;
    }
    return true;
  };

  const statusCounts = getStatusCounts();

  return (
    <div>
      {alertMessage && (
        <Alert variant={alertVariant} className="text-center">
          {alertMessage}
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <ButtonGroup className="ms-auto">
          <Button variant="outline-primary" onClick={() => setViewMode("card")}>
            <FaThLarge /> Card View
          </Button>
          <Button variant="outline-primary" onClick={() => setViewMode("table")}>
            <FaThList /> Table View
          </Button>
        </ButtonGroup>
        <Dropdown className="ms-3">
          <Dropdown.Toggle variant="outline-primary">
            <FaTags /> Filter by Status
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleFilterChange("")}>All</Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilterChange("submitted")}>
              Submitted ({statusCounts.submitted || 0})
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilterChange("under_review")}>
              Under Review ({statusCounts.under_review || 0})
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilterChange("accepted")}>
              Accepted ({statusCounts.accepted || 0})
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilterChange("rejected")}>
              Rejected ({statusCounts.rejected || 0})
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilterChange("awaiting_full_submission")}>
              Awaiting Full Submission ({statusCounts.awaiting_full_submission || 0})
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => setShowAddModal(true)}>
              <FaSave /> Add Abstract
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {viewMode === "card" ? (
        <div className="d-flex flex-wrap">
          {filteredItems.map((item) => (
            <Card key={item.id} className="mb-3 me-3" style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title>{item.title}</Card.Title>
                {item.abstract_image && (
                  <Card.Img variant="top" src={item.abstract_image} alt="Abstract Image" />
                )}
                {/* <Card.Text>{item.content_text}</Card.Text>
                <Card.Text><FaFileAlt /> {item.content_type.toUpperCase()}</Card.Text> */}
                <div className="d-flex justify-content-between">
                  <Button variant="outline-info" onClick={() => handleViewItem(item)}>
                    <FaEye /> View
                  </Button>
                  <Button variant="outline-primary" onClick={() => handleUpdateItem(item)}>
                    <FaPen /> Edit
                  </Button>
                  <Button variant="outline-danger" onClick={() => handleDeleteItem(item.id)}>
                    <FaTrash /> Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Author</th>
              <th>Title</th>
              <th>Content</th>
              <th>Status</th>
              <th>Document</th>
              <th>Image</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.author}</td>
                <td>{item.title}</td>
                <td>{item.content_text}</td>
                <td>{item.status}</td>
                <td>
                  {item.document && (
                    <a href={item.document} target="_blank" rel="noopener noreferrer">
                      <FaFileDownload /> Download
                    </a>
                  )}
                </td>
                <td>
                  {item.abstract_image && (
                    <img src={item.abstract_image} alt="Abstract" style={{ width: "50px" }} />
                  )}
                </td>
                <td>{item.content_type.toUpperCase()}</td>
                <td>
                  <ButtonGroup>
                    <Button variant="outline-info" onClick={() => handleViewItem(item)}>
                      <FaEye /> View
                    </Button>
                    <Button variant="outline-primary" onClick={() => handleUpdateItem(item)}>
                      <FaPen /> Edit
                    </Button>
                    <Button variant="outline-danger" onClick={() => handleDeleteItem(item.id)}>
                      <FaTrash /> Delete
                    </Button>
                  </ButtonGroup>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Abstract</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                name="author"
                value={newItem.author}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newItem.title}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="content_text"
                value={newItem.content_text}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={newItem.status}
                onChange={handleChange}
              >
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="awaiting_full_submission">Awaiting Full Submission</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Document</Form.Label>
              <Form.Control
                type="file"
                name="document"
                onChange={handleFileChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="abstract_image"
                onChange={handleFileChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Content Type</Form.Label>
              <Form.Control
                as="select"
                name="content_type"
                value={newItem.content_type}
                onChange={handleChange}
              >
                <option value="pdf">PDF</option>
                <option value="img">Image</option>
                <option value="jpeg">JPEJ</option>
                <option value="Png">PNG</option>
                <option value="mp4">Image</option>
                <option value="txt">TXT</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddItem}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Abstract</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Author</Form.Label>
              <Form.Control
                type="text"
                name="author"
                value={newItem.author}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newItem.title}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="content_text"
                value={newItem.content_text}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={newItem.status}
                onChange={handleChange}
              >
                <option value="submitted">Submitted</option>
                <option value="under_review">Under Review</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="awaiting_full_submission">Awaiting Full Submission</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Document</Form.Label>
              <Form.Control
                type="file"
                name="document"
                onChange={handleFileChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="abstract_image"
                onChange={handleFileChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Content Type</Form.Label>
              <Form.Control
                as="select"
                name="content_type"
                value={newItem.content_type}
                onChange={handleChange}
              >
                <option value="pdf">PDF</option>
                <option value="img">Image</option>
                <option value="jpeg">JPEJ</option>
                <option value="Png">PNG</option>
                <option value="mp4">Image</option>
                <option value="txt">TXT</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>View Abstract</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <div>
              <h5>Author: {selectedItem.author}</h5>
              <h5>Title: {selectedItem.title}</h5>
              <p>Content: {selectedItem.content_text}</p>
              <p>Status: {selectedItem.status}</p>
              {selectedItem.document && (
                <p>
                  Document:{" "}
                  <a href={selectedItem.document} target="_blank" rel="noopener noreferrer">
                    <FaFileDownload /> Download
                  </a>
                </p>
              )}
              {selectedItem.abstract_image && (
                <p>
                  <img src={selectedItem.abstract_image} alt="Abstract" style={{ width: "100%" }} />
                </p>
              )}
              <p>Content Type: {selectedItem.content_type.toUpperCase()}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Paper;
