import React, { useState } from "react";
import { Modal, Form, Button, Alert, Row, Col } from "react-bootstrap";
import { FaSave } from "react-icons/fa";

const TrackEvents = ({ fetchEvents = () => {}, showAlert = () => {} }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
    registration_start_date: "",
    registration_end_date: "",
    registration_fee: "",
    available_seat: 0,
    event_type: "Conference",
    organizer_name: "",
    organizer_contact: "",
    target_audience: "",
    keywords: "",
    event_status: "Scheduled",
    banner_image: null,
  });
  const [formErrors, setFormErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewEvent((prevEvent) => ({
        ...prevEvent,
        banner_image: file,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!newEvent.name) errors.name = "Event name is required";
    if (!newEvent.date) errors.date = "Event date is required";
    if (!newEvent.location) errors.location = "Event location is required";
    if (!newEvent.registration_start_date) errors.registration_start_date = "Registration start date is required";
    if (!newEvent.registration_end_date) errors.registration_end_date = "Registration end date is required";
    if (!newEvent.organizer_name) errors.organizer_name = "Organizer name is required";
    if (!newEvent.organizer_contact) errors.organizer_contact = "Organizer contact is required";
    if (newEvent.registration_fee && isNaN(newEvent.registration_fee)) errors.registration_fee = "Registration fee must be a number";
    if (newEvent.available_seat && isNaN(newEvent.available_seat)) errors.available_seat = "Available seats must be a number";
    return errors;
  };

  const handleAddEvent = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
      return;
    }

    try {
      setIsLoading(true);
      const formData = new FormData();
      for (const key in newEvent) {
        formData.append(key, newEvent[key]);
      }

      const response = await fetch("http://127.0.0.1:8000/api/physical-events/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        fetchEvents();
        setShowAddModal(false);
        showAlert("Event added successfully!", "success");
        setShowSuccessMessage(true);
        setShowNextButton(true);
        setNewEvent({
          name: "",
          description: "",
          date: "",
          location: "",
          registration_start_date: "",
          registration_end_date: "",
          registration_fee: "",
          available_seat: 0,
          event_type: "Conference",
          organizer_name: "",
          organizer_contact: "",
          target_audience: "",
          keywords: "",
          event_status: "Scheduled",
          banner_image: null,
        });
        setTimeout(() => {
          setShowSuccessMessage(false);
        }, 3000);
      } else {
        console.error("Error adding event:", response.status);
        setShowErrorMessage(true);
        setTimeout(() => setShowErrorMessage(false), 3000);
      }
    } catch (error) {
      console.error("Error adding event:", error);
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        variant="primary"
        onClick={() => setShowAddModal(true)}
        className="mb-3"
        style={{ fontSize: "0.9rem", padding: "0.5rem 1rem" }}
      >
        <FaSave /> Create Event
      </Button>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Register New Event by Filling out the details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showSuccessMessage && <Alert variant="success">Event created successfully! Be ready for the next step.</Alert>}
          {showErrorMessage && <Alert variant="danger">Error creating event. Please check the form and try again.</Alert>}
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={newEvent.name}
                    onChange={handleChange}
                    isInvalid={!!formErrors.name}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.name}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="description"
                    value={newEvent.description}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={newEvent.date}
                    onChange={handleChange}
                    isInvalid={!!formErrors.date}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.date}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={newEvent.location}
                    onChange={handleChange}
                    isInvalid={!!formErrors.location}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.location}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Registration Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="registration_start_date"
                    value={newEvent.registration_start_date}
                    onChange={handleChange}
                    isInvalid={!!formErrors.registration_start_date}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.registration_start_date}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Registration End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="registration_end_date"
                    value={newEvent.registration_end_date}
                    onChange={handleChange}
                    isInvalid={!!formErrors.registration_end_date}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.registration_end_date}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Registration Fee</Form.Label>
                  <Form.Control
                    type="number"
                    name="registration_fee"
                    value={newEvent.registration_fee}
                    onChange={handleChange}
                    isInvalid={!!formErrors.registration_fee}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.registration_fee}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Available Seats</Form.Label>
                  <Form.Control
                    type="number"
                    name="available_seat"
                    value={newEvent.available_seat}
                    onChange={handleChange}
                    isInvalid={!!formErrors.available_seat}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.available_seat}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Type</Form.Label>
                  <Form.Control as="select" name="event_type" value={newEvent.event_type} onChange={handleChange}>
                    {[
                      "Conference",
                      "Workshop",
                      "Seminar",
                      "Meetup",
                      "Lecture",
                      "Training",
                      "Networking",
                      "Exhibition",
                      "Competition",
                      "Webinar",
                      "Party",
                      "Festival",
                      "Concert",
                      "Trade Show",
                      "Launch Event",
                      "Social Event",
                      "Sports Event",
                      "Charity Event",
                      "Fundraiser",
                      "Panel Discussion",
                      "Virtual Event",
                      "Gala",
                      "Retreat",
                    ].map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Organizer Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="organizer_name"
                    value={newEvent.organizer_name}
                    onChange={handleChange}
                    isInvalid={!!formErrors.organizer_name}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.organizer_name}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Organizer Contact</Form.Label>
                  <Form.Control
                    type="text"
                    name="organizer_contact"
                    value={newEvent.organizer_contact}
                    onChange={handleChange}
                    isInvalid={!!formErrors.organizer_contact}
                  />
                  <Form.Control.Feedback type="invalid">{formErrors.organizer_contact}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Target Audience</Form.Label>
                  <Form.Control
                    type="text"
                    name="target_audience"
                    value={newEvent.target_audience}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Keywords</Form.Label>
                  <Form.Control
                    type="text"
                    name="keywords"
                    value={newEvent.keywords}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Event Status</Form.Label>
                  <Form.Control as="select" name="event_status" value={newEvent.event_status} onChange={handleChange}>
                    <option>Scheduled</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Banner Image</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} />
            </Form.Group>
            <Button
              variant="primary"
              onClick={handleAddEvent}
              disabled={isLoading}
              style={{ fontSize: "0.9rem", padding: "0.5rem 1rem" }}
            >
              {isLoading ? 'Creating...' : 'Create Event'}
            </Button>
            {showNextButton && (
              <Button
                variant="success"
                onClick={() => window.location.href = "/create-agenda"}
                style={{ fontSize: "0.9rem", padding: "0.5rem 1rem", marginLeft: "1rem" }}
              >
                Next
              </Button>
            )}
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TrackEvents;
