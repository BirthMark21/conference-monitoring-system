import React, { useState } from "react";
import { Modal, Form, Alert, Row, Col, Dropdown } from "react-bootstrap";
import { FaSave } from "react-icons/fa";
// import './SetAgenda.css'; // Assuming you have a CSS file for custom styles

const SetAgenda = ({ fetchAgendas = () => {}, showAlert = () => {} }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAgenda, setNewAgenda] = useState({
    title: "",
    start_time: "",
    end_time: "",
    description: "",
    event_order: 0,
    moderator: "",
    image: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAgenda((prevAgenda) => ({
      ...prevAgenda,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAgenda((prevAgenda) => ({
        ...prevAgenda,
        image: file,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!newAgenda.title) errors.title = "Title is required";
    if (!newAgenda.start_time) errors.start_time = "Start time is required";
    if (!newAgenda.end_time) errors.end_time = "End time is required";
    if (newAgenda.start_time >= newAgenda.end_time) errors.time = "Start time must be before end time";
    return errors;
  };

  const handleAddAgenda = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
      return;
    }

    try {
      const formData = new FormData();
      for (const key in newAgenda) {
        formData.append(key, newAgenda[key]);
      }

      const response = await fetch("http://127.0.0.1:8000/api/agenda/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        fetchAgendas();
        setShowAddModal(false);
        showAlert("Agenda added successfully!", "success");
        setShowSuccessMessage(true);
        setNewAgenda({
          title: "",
          start_time: "",
          end_time: "",
          description: "",
          event_order: 0,
          moderator: "",
          image: null,
        });
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      } else {
        console.error("Error adding agenda:", response.status);
        setShowErrorMessage(true);
        setTimeout(() => setShowErrorMessage(false), 3000);
      }
    } catch (error) {
      console.error("Error adding agenda:", error);
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
    }
  };

  return (
    <div className="set-agenda-container">
      <Dropdown className="options-dropdown">
        <Dropdown.Toggle className="custom-dropdown-toggle">
          <FaSave /> Options
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item onClick={() => setShowAddModal(true)}>Create Agenda</Dropdown.Item>
          <Dropdown.Item onClick={() => console.log("Back to View Agenda")}>Back to View Agenda</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} dialogClassName="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Create New Agenda Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showSuccessMessage && <Alert variant="success">Agenda created successfully!</Alert>}
          {showErrorMessage && <Alert variant="danger">Error creating agenda. Please check the form and try again.</Alert>}
          <Form>
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={newAgenda.title}
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
                    value={newAgenda.start_time}
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
                    value={newAgenda.end_time}
                    onChange={handleChange}
                    isInvalid={!!formErrors.end_time || formErrors.time}
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
                    value={newAgenda.description}
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
                    value={newAgenda.event_order}
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
                    value={newAgenda.moderator}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} />
            </Form.Group>
            <div className="button-group centered-buttons">
              <button
                type="button"
                className="custom-button primary"
                onClick={handleAddAgenda}
              >
                Create Agenda Item
              </button>
              <button
                type="button"
                className="custom-button secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default SetAgenda;
