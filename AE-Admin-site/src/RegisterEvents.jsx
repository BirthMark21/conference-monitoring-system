// RegisterEvents.jsx
import React, { useContext, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { FaceContext } from "./FaceContext";

const RegisterEvents = () => {
  const { fetchEvents, showAlert, speakers, sponsors } = useContext(FaceContext);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
    registration_start_date: "",
    registration_end_date: "",
    registration_fee: "",
    available_seat: "",
    event_type: "Conference",
    event_status: "Scheduled",
    organizer_name: "",
    organizer_contact: "",
    target_audience: "",
    keywords: "",
    banner_image: null,
    Speakers_eents: "",
    Sponsor_events: "",
  });

  const handleAddEvent = async () => {
    try {
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
      } else {
        console.error("Error adding event:", response.status);
        showAlert("Error adding event", "danger");
      }
    } catch (error) {
      console.error("Error adding event:", error);
      showAlert("Error adding event", "danger");
    }
  };

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

  return (
    <>
      <Button variant="primary" onClick={() => setShowAddModal(true)}>
        Add Event
      </Button>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newEvent.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newEvent.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="datetime-local"
                name="date"
                value={newEvent.date}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={newEvent.location}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Registration Start Date</Form.Label>
              <Form.Control
                type="datetime-local"
                name="registration_start_date"
                value={newEvent.registration_start_date}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Registration End Date</Form.Label>
              <Form.Control
                type="datetime-local"
                name="registration_end_date"
                value={newEvent.registration_end_date}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Registration Fee</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="registration_fee"
                value={newEvent.registration_fee}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Available Seats</Form.Label>
              <Form.Control
                type="number"
                name="available_seat"
                value={newEvent.available_seat}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Event Type</Form.Label>
              <Form.Control
                as="select"
                name="event_type"
                value={newEvent.event_type}
                onChange={handleChange}
              >
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
            <Form.Group>
              <Form.Label>Event Status</Form.Label>
              <Form.Control
                as="select"
                name="event_status"
                value={newEvent.event_status}
                onChange={handleChange}
              >
                {["Scheduled", "Ongoing", "Completed", "Cancelled"].map(
                  (status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  )
                )}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Organizer Name</Form.Label>
              <Form.Control
                type="text"
                name="organizer_name"
                value={newEvent.organizer_name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Organizer Contact</Form.Label>
              <Form.Control
                type="text"
                name="organizer_contact"
                value={newEvent.organizer_contact}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Target Audience</Form.Label>
              <Form.Control
                type="text"
                name="target_audience"
                value={newEvent.target_audience}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Keywords</Form.Label>
              <Form.Control
                type="text"
                name="keywords"
                value={newEvent.keywords}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Banner Image</Form.Label>
              <Form.Control
                type="file"
                name="banner_image"
                onChange={handleImageChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Speakers</Form.Label>
              <Form.Control
                as="select"
                name="Speakers_eents"
                value={newEvent.Speakers_eents}
                onChange={handleChange}
              >
                <option value="">Select a Speaker</option>
                {speakers.map((speaker) => (
                  <option key={speaker.id} value={speaker.id}>
                    {speaker.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Sponsors</Form.Label>
              <Form.Control
                as="select"
                name="Sponsor_events"
                value={newEvent.Sponsor_events}
                onChange={handleChange}
              >
                <option value="">Select a Sponsor</option>
                {sponsors.map((sponsor) => (
                  <option key={sponsor.id} value={sponsor.id}>
                    {sponsor.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" onClick={handleAddEvent}>
              Add Event
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RegisterEvents;
