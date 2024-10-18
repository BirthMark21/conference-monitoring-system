import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";

const EventUpdateTrack = ({ selectedEvent, fetchEvents, showAlert, setShowUpdateModal, showUpdateModal }) => {
  const [updatedEvent, setUpdatedEvent] = useState(selectedEvent);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUpdatedEvent((prevEvent) => ({
        ...prevEvent,
        banner_image: file,
      }));
    }
  };

  const handleUpdateEvent = async () => {
    try {
      const formData = new FormData();
      for (const key in updatedEvent) {
        formData.append(key, updatedEvent[key]);
      }

      const response = await fetch(`http://127.0.0.1:8000/api/physical-events/${updatedEvent.id}/`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        fetchEvents();
        setShowUpdateModal(false);
        showAlert("Event updated successfully!", "success");
      } else {
        console.error("Error updating event:", response.status);
        showAlert("Error updating event", "danger");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      showAlert("Error updating event", "danger");
    }
  };

  return (
    <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Update Event</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Event Name</Form.Label>
            <Form.Control type="text" name="name" value={updatedEvent.name} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" name="description" value={updatedEvent.description} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Date</Form.Label>
            <Form.Control type="date" name="date" value={updatedEvent.date} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control type="text" name="location" value={updatedEvent.location} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Registration Start Date</Form.Label>
            <Form.Control type="date" name="registration_start_date" value={updatedEvent.registration_start_date} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Registration End Date</Form.Label>
            <Form.Control type="date" name="registration_end_date" value={updatedEvent.registration_end_date} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Registration Fee</Form.Label>
            <Form.Control type="number" name="registration_fee" value={updatedEvent.registration_fee} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Available Seats</Form.Label>
            <Form.Control type="number" name="available_seat" value={updatedEvent.available_seat} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Event Type</Form.Label>
            <Form.Control as="select" name="event_type" value={updatedEvent.event_type} onChange={handleChange}>
              <option>Conference</option>
              <option>Workshop</option>
              <option>Seminar</option>
              <option>Meetup</option>
              <option>Lecture</option>
              <option>Training</option>
              <option>Networking</option>
              <option>Exhibition</option>
              <option>Competition</option>
              <option>Webinar</option>
              <option>Party</option>
              <option>Festival</option>
              <option>Concert</option>
              <option>Trade Show</option>
              <option>Launch Event</option>
              <option>Social Event</option>
              <option>Sports Event</option>
              <option>Charity Event</option>
              <option>Fundraiser</option>
              <option>Panel Discussion</option>
              <option>Virtual Event</option>
              <option>Gala</option>
              <option>Retreat</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Organizer Name</Form.Label>
            <Form.Control type="text" name="organizer_name" value={updatedEvent.organizer_name} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Organizer Contact</Form.Label>
            <Form.Control type="text" name="organizer_contact" value={updatedEvent.organizer_contact} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Target Audience</Form.Label>
            <Form.Control type="text" name="target_audience" value={updatedEvent.target_audience} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Keywords</Form.Label>
            <Form.Control type="text" name="keywords" value={updatedEvent.keywords} onChange={handleChange} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Event Status</Form.Label>
            <Form.Control as="select" name="event_status" value={updatedEvent.event_status} onChange={handleChange}>
              <option>Scheduled</option>
              <option>Completed</option>
              <option>Cancelled</option>
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Banner Image</Form.Label>
            <Form.Control type="file" onChange={handleImageChange} />
          </Form.Group>
          <Button variant="primary" onClick={handleUpdateEvent}>
            Update Event
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EventUpdateTrack;
