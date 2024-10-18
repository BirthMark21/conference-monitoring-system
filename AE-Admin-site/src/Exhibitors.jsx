import React, { useState, useEffect } from "react";
import { Table, Card, Button, Modal, Form, Alert, ButtonGroup } from "react-bootstrap";
import {
  FaSave,
  FaPen,
  FaTrash,
  FaThList,
  FaThLarge,
  FaEye,
  FaGlobe,
  FaMapMarkerAlt,
  FaUser,
  FaImage,
  FaCheckCircle,
  FaExclamationCircle,
  FaSortNumericDown, // Import the missing icon
  FaAlignLeft // Import this icon for description column
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Exhibitors = () => {
  const [exhibitors, setExhibitors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedExhibitor, setSelectedExhibitor] = useState(null);
  const [newExhibitor, setNewExhibitor] = useState({
    name: "",
    description: "",
    address: "",
    website: "",
    social_media_link: "",
    image: null,
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [viewMode, setViewMode] = useState("card");

  useEffect(() => {
    fetchExhibitors();
  }, []);

  const fetchExhibitors = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/exhibitors/");
      if (response.ok) {
        const data = await response.json();
        setExhibitors(data);
      } else {
        console.error("Error fetching exhibitors:", response.status);
      }
    } catch (error) {
      console.error("Error fetching exhibitors:", error);
    }
  };

  const handleAddExhibitor = async () => {
    if (!newExhibitor.name || !newExhibitor.description) {
      showAlert("Name and Description are required.", "danger");
      return;
    }
    try {
      const formData = new FormData();
      for (const key in newExhibitor) {
        formData.append(key, newExhibitor[key]);
      }

      const response = await fetch("http://127.0.0.1:8000/api/exhibitors/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        fetchExhibitors();
        setShowAddModal(false);
        showAlert("Exhibitor added successfully!", "success");
      } else {
        console.error("Error adding exhibitor:", response.status);
        showAlert("Error adding exhibitor", "danger");
      }
    } catch (error) {
      console.error("Error adding exhibitor:", error);
      showAlert("Error adding exhibitor", "danger");
    }
  };

  const handleDeleteExhibitor = async (exhibitorId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/exhibitors/${exhibitorId}/`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchExhibitors();
        showAlert("Exhibitor deleted successfully!", "success");
      } else {
        console.error("Error deleting exhibitor:", response.status);
        showAlert("Error deleting exhibitor", "danger");
      }
    } catch (error) {
      console.error("Error deleting exhibitor:", error);
      showAlert("Error deleting exhibitor", "danger");
    }
  };

  const handleUpdateExhibitor = (exhibitor) => {
    setSelectedExhibitor(exhibitor);
    setNewExhibitor({
      ...exhibitor,
      name: exhibitor.name || "",
      description: exhibitor.description || "",
      address: exhibitor.address || "",
      website: exhibitor.website || "",
      social_media_link: exhibitor.social_media_link || "",
      image: exhibitor.image || null,
    });
    setShowUpdateModal(true);
  };

  const handleViewExhibitor = (exhibitor) => {
    setSelectedExhibitor(exhibitor);
    setShowViewModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewExhibitor((prevExhibitor) => ({
      ...prevExhibitor,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewExhibitor((prevExhibitor) => ({
        ...prevExhibitor,
        image: file,
      }));
    }
  };

  const handleUpdateSubmit = async () => {
    if (!newExhibitor.name || !newExhibitor.description) {
      showAlert("Name and Description are required.", "danger");
      return;
    }
    try {
      const formData = new FormData();
      for (const key in newExhibitor) {
        formData.append(key, newExhibitor[key]);
      }

      const response = await fetch(`http://127.0.0.1:8000/api/exhibitors/${newExhibitor.id}/`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        fetchExhibitors();
        setShowUpdateModal(false);
        showAlert("Exhibitor updated successfully!", "success");
      } else {
        console.error("Error updating exhibitor:", response.status);
        showAlert("Error updating exhibitor", "danger");
      }
    } catch (error) {
      console.error("Error updating exhibitor:", error);
      showAlert("Error updating exhibitor", "danger");
    }
  };

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
        <ButtonGroup className="ms-auto">
          <Button variant="outline-primary" onClick={() => setViewMode("card")}>
            <FaThLarge /> Card View
          </Button>
          <Button variant="outline-primary" onClick={() => setViewMode("table")}>
            <FaThList /> Table View
          </Button>
        </ButtonGroup>
      </div>

      <Button variant="primary" onClick={() => setShowAddModal(true)} className="mb-3">
        <FaSave /> Add Exhibitor
      </Button>

      {viewMode === "card" ? (
        <div className="d-flex flex-wrap">
          {exhibitors.map((exhibitor) => (
            <Card key={exhibitor.id} className="mb-3 me-3" style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title>{exhibitor.name}</Card.Title>
                <Card.Text>
                  {exhibitor.description}
                </Card.Text>
                {exhibitor.image && (
                  <Card.Img variant="top" src={exhibitor.image} alt="Exhibitor Image" />
                )}
                <div className="d-flex justify-content-between">
                  <Button variant="outline-info" onClick={() => handleViewExhibitor(exhibitor)}>
                    <FaEye /> View
                  </Button>
                  <Button variant="outline-primary" onClick={() => handleUpdateExhibitor(exhibitor)}>
                    <FaPen /> Edit
                  </Button>
                  <Button variant="outline-danger" onClick={() => handleDeleteExhibitor(exhibitor.id)}>
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
              <th><FaSortNumericDown /> #</th>
              <th><FaUser /> Name</th>
              <th><FaAlignLeft /> Description</th>
              <th><FaMapMarkerAlt /> Address</th>
              <th><FaGlobe /> Website</th>
              <th><FaUser /> Social Media Link</th>
              <th><FaImage /> Image</th>
              <th><FaEye /> Actions</th>
            </tr>
          </thead>
          <tbody>
            {exhibitors.map((exhibitor, index) => (
              <tr key={exhibitor.id}>
                <td>{index + 1}</td>
                <td>{exhibitor.name}</td>
                <td>{exhibitor.description}</td>
                <td>{exhibitor.address}</td>
                <td>{exhibitor.website}</td>
                <td>{exhibitor.social_media_link}</td>
                <td>
                  {exhibitor.image && (
                    <img src={exhibitor.image} alt="Exhibitor" className="img-fluid" />
                  )}
                </td>
                <td>
                  <Button variant="outline-info" onClick={() => handleViewExhibitor(exhibitor)} className="me-2">
                    <FaEye /> View
                  </Button>
                  <Button variant="outline-primary" onClick={() => handleUpdateExhibitor(exhibitor)} className="me-2">
                    <FaPen /> Edit
                  </Button>
                  <Button variant="outline-danger" onClick={() => handleDeleteExhibitor(exhibitor.id)}>
                    <FaTrash /> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Add Exhibitor Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Exhibitor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newExhibitor.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDescription" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={newExhibitor.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formAddress" className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={newExhibitor.address}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formWebsite" className="mb-3">
              <Form.Label>Website</Form.Label>
              <Form.Control
                type="url"
                name="website"
                value={newExhibitor.website}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formSocialMediaLink" className="mb-3">
              <Form.Label>Social Media Link</Form.Label>
              <Form.Control
                type="url"
                name="social_media_link"
                value={newExhibitor.social_media_link}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formImage" className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddExhibitor}>
            <FaSave /> Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Exhibitor Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Exhibitor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newExhibitor.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formDescription" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={newExhibitor.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formAddress" className="mb-3">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                name="address"
                value={newExhibitor.address}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formWebsite" className="mb-3">
              <Form.Label>Website</Form.Label>
              <Form.Control
                type="url"
                name="website"
                value={newExhibitor.website}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formSocialMediaLink" className="mb-3">
              <Form.Label>Social Media Link</Form.Label>
              <Form.Control
                type="url"
                name="social_media_link"
                value={newExhibitor.social_media_link}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formImage" className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateSubmit}>
            <FaSave /> Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Exhibitor Modal */}
      {selectedExhibitor && (
        <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>View Exhibitor</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>{selectedExhibitor.name}</h4>
            <p>{selectedExhibitor.description}</p>
            <p><FaMapMarkerAlt /> {selectedExhibitor.address}</p>
            <p><FaGlobe /> <a href={selectedExhibitor.website} target="_blank" rel="noopener noreferrer">{selectedExhibitor.website}</a></p>
            <p><FaUser /> <a href={selectedExhibitor.social_media_link} target="_blank" rel="noopener noreferrer">{selectedExhibitor.social_media_link}</a></p>
            {selectedExhibitor.image && <img src={selectedExhibitor.image} alt="Exhibitor" className="img-fluid" />}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowViewModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Exhibitors;
