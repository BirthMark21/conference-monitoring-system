import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Alert, Row, Col, Table } from "react-bootstrap";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const ViewSchedule = ({ fetchAgendas = () => {}, showAlert = () => {} }) => {
  const [agendas, setAgendas] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentAgenda, setCurrentAgenda] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  useEffect(() => {
    fetchAgendas().then(data => setAgendas(data));
  }, [fetchAgendas]);

  const handleEditClick = (agenda) => {
    setCurrentAgenda({ ...agenda });
    setShowEditModal(true);
  };

  const handleDeleteClick = async (agendaId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/agendas/${agendaId}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchAgendas();
        showAlert("Agenda deleted successfully!", "success");
      } else {
        console.error("Error deleting agenda:", response.status);
        showAlert("Error deleting agenda.", "danger");
      }
    } catch (error) {
      console.error("Error deleting agenda:", error);
      showAlert("Error deleting agenda.", "danger");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentAgenda((prevAgenda) => ({
      ...prevAgenda,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentAgenda((prevAgenda) => ({
        ...prevAgenda,
        image: file,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!currentAgenda.title) errors.title = "Title is required";
    if (!currentAgenda.start_time) errors.start_time = "Start time is required";
    if (!currentAgenda.end_time) errors.end_time = "End time is required";
    if (currentAgenda.start_time >= currentAgenda.end_time) errors.time = "Start time must be before end time";
    return errors;
  };

  const handleUpdateAgenda = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
      return;
    }

    try {
      const formData = new FormData();
      for (const key in currentAgenda) {
        formData.append(key, currentAgenda[key]);
      }

      const response = await fetch(`http://127.0.0.1:8000/api/agendas/${currentAgenda.id}/`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        fetchAgendas();
        setShowEditModal(false);
        showAlert("Agenda updated successfully!", "success");
        setShowSuccessMessage(true);
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      } else {
        console.error("Error updating agenda:", response.status);
        setShowErrorMessage(true);
        setTimeout(() => setShowErrorMessage(false), 3000);
      }
    } catch (error) {
      console.error("Error updating agenda:", error);
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
    }
  };

  return (
    <div>
      <h2>Agenda List</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Description</th>
            <th>Event Order</th>
            <th>Moderator</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {agendas.map((agenda) => (
            <tr key={agenda.id}>
              <td>{agenda.title}</td>
              <td>{agenda.start_time}</td>
              <td>{agenda.end_time}</td>
              <td>{agenda.description}</td>
              <td>{agenda.event_order}</td>
              <td>{agenda.moderator}</td>
              <td>
                <Button variant="warning" onClick={() => handleEditClick(agenda)} className="me-2">
                  <FaEdit /> Edit
                </Button>
                <Button variant="danger" onClick={() => handleDeleteClick(agenda.id)}>
                  <FaTrashAlt /> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Agenda Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showSuccessMessage && <Alert variant="success">Agenda updated successfully!</Alert>}
          {showErrorMessage && <Alert variant="danger">Error updating agenda. Please check the form and try again.</Alert>}
          {currentAgenda && (
            <Form>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={currentAgenda.title}
                      onChange={handleChange}
                      isInvalid={!!formErrors.title}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.title}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="start_time"
                      value={currentAgenda.start_time}
                      onChange={handleChange}
                      isInvalid={!!formErrors.start_time || !!formErrors.time}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.start_time || formErrors.time}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>End Time</Form.Label>
                    <Form.Control
                      type="datetime-local"
                      name="end_time"
                      value={currentAgenda.end_time}
                      onChange={handleChange}
                      isInvalid={!!formErrors.end_time || !!formErrors.time}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.end_time || formErrors.time}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      value={currentAgenda.description}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Event Order</Form.Label>
                    <Form.Control
                      type="number"
                      name="event_order"
                      value={currentAgenda.event_order}
                      onChange={handleChange}
                      isInvalid={!!formErrors.event_order}
                    />
                    <Form.Control.Feedback type="invalid">{formErrors.event_order}</Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Moderator</Form.Label>
                    <Form.Control
                      type="text"
                      name="moderator"
                      value={currentAgenda.moderator}
                      onChange={handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Image</Form.Label>
                <Form.Control type="file" onChange={handleImageChange} />
              </Form.Group>
              <Button
                variant="primary"
                onClick={handleUpdateAgenda}
                style={{ fontSize: "0.9rem", padding: "0.5rem 1rem" }}
              >
                Update Agenda Item
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ViewSchedule;
