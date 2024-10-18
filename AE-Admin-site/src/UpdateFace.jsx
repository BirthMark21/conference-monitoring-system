import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import { FaSave, FaEdit } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const eventTypes = [
  "Conference", "Workshop", "Seminar", "Meetup", "Lecture", "Training",
  "Networking", "Exhibition", "Competition", "Webinar", "Party", "Festival",
  "Concert", "Trade Show", "Launch Event", "Social Event", "Sports Event",
  "Charity Event", "Fundraiser", "Panel Discussion", "Virtual Event", "Gala", "Retreat"
];

const eventStatuses = ["Scheduled", "Postponed", "Cancelled", "Completed"];

const UpdateFace = ({ eventId }) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [event, setEvent] = useState(null);
  const [speakers, setSpeakers] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [eventOrganizers, setEventOrganizers] = useState([]);
  const [venues, setVenues] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");

  useEffect(() => {
    fetchEvent();
    fetchSpeakers();
    fetchSponsors();
    fetchEventOrganizers();
    fetchVenues();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/physical-events/${eventId}/`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data);
      } else {
        console.error("Error fetching event:", response.status);
      }
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };

  const fetchSpeakers = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/speakers/");
      if (response.ok) {
        const data = await response.json();
        setSpeakers(data);
      } else {
        console.error("Error fetching speakers:", response.status);
      }
    } catch (error) {
      console.error("Error fetching speakers:", error);
    }
  };

  const fetchSponsors = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/sponsors/");
      if (response.ok) {
        const data = await response.json();
        setSponsors(data);
      } else {
        console.error("Error fetching sponsors:", response.status);
      }
    } catch (error) {
      console.error("Error fetching sponsors:", error);
    }
  };

  const fetchEventOrganizers = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/eventusers/");
      if (response.ok) {
        const data = await response.json();
        setEventOrganizers(data);
      } else {
        console.error("Error fetching event organizers:", response.status);
      }
    } catch (error) {
      console.error("Error fetching event organizers:", error);
    }
  };

  const fetchVenues = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/venues/");
      if (response.ok) {
        const data = await response.json();
        setVenues(data);
      } else {
        console.error("Error fetching venues:", response.status);
      }
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

  const handleUpdateEvent = async () => {
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      for (const key in event) {
        if (Array.isArray(event[key])) {
          event[key].forEach(item => formData.append(key, item));
        } else {
          formData.append(key, event[key]);
        }
      }

      const response = await fetch(`http://localhost:8000/api/physical-events/${eventId}/`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        showAlert("Event updated successfully!", "success");
        setShowUpdateModal(false);
      } else {
        console.error("Error updating event:", response.status);
        showAlert("Error updating event", "danger");
      }
    } catch (error) {
      console.error("Error updating event:", error);
      showAlert("Error updating event", "danger");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };

  const handleMultiSelectChange = (e) => {
    const { name, options } = e.target;
    const selectedOptions = Array.from(options).filter(option => option.selected).map(option => option.value);
    setEvent((prevEvent) => ({
      ...prevEvent,
      [name]: selectedOptions,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEvent((prevEvent) => ({
        ...prevEvent,
        banner_image: file,
      }));
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
    if (!event.name || !event.date || !event.location || !event.registration_end_date || !event.registration_fee) {
      showAlert("Please fill in all required fields", "danger");
      return false;
    }
    return true;
  };

  return (
    <div>
      {alertMessage && (
        <Alert variant={alertVariant} className="text-center">
          {alertMessage}
        </Alert>
      )}

      <Button variant="outline-primary" onClick={() => setShowUpdateModal(true)}>
        <FaEdit /> Edit Event
      </Button>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {event && (
            <Form>
              <Form.Group controlId="formEventName" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" name="name" value={event.name} onChange={handleChange} />
              </Form.Group>
              <Form.Group controlId="formEventSpeakers" className="mb-3">
                <Form.Label>Speakers</Form.Label>
                <Form.Control as="select" name="speakers" multiple value={event.speakers} onChange={handleMultiSelectChange}>
                  {speakers.map((speaker) => (
                    <option key={speaker.id} value={speaker.id}>
                      {speaker.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formEventSponsors" className="mb-3">
                <Form.Label>Sponsors</Form.Label>
                <Form.Control as="select" name="sponsors" multiple value={event.sponsors} onChange={handleMultiSelectChange}>
                  {sponsors.map((sponsor) => (
                    <option key={sponsor.id} value={sponsor.id}>
                      {sponsor.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formEventVenues" className="mb-3">
                <Form.Label>Event Venues</Form.Label>
                <Form.Control as="select" name="event_venues" multiple value={event.event_venues} onChange={handleMultiSelectChange}>
                  {venues.map((venue) => (
                    <option key={venue.id} value={venue.id}>
                      {venue.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formEventDescription" className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" name="description" value={event.description} onChange={handleChange} />
              </Form.Group>
              <Form.Group controlId="formEventBannerImage" className="mb-3">
                <Form.Label>Banner Image</Form.Label>
                <Form.Control type="file" name="banner_image" onChange={handleImageChange} />
              </Form.Group>
              <Form.Group controlId="formEventDate" className="mb-3">
                <Form.Label>Date</Form.Label>
                <Form.Control type="datetime-local" name="date" value={event.date} onChange={handleChange} />
              </Form.Group>
              <Form.Group controlId="formEventLocation" className="mb-3">
                <Form.Label>Location</Form.Label>
                <Form.Control type="text" name="location" value={event.location} onChange={handleChange} />
              </Form.Group>
              <Form.Group controlId="formRegistrationStartDate" className="mb-3">
                <Form.Label>Registration Start Date</Form.Label>
                <Form.Control type="datetime-local" name="registration_start_date" value={event.registration_start_date} onChange={handleChange} />
              </Form.Group>
              <Form.Group controlId="formRegistrationEndDate" className="mb-3">
                <Form.Label>Registration End Date</Form.Label>
                <Form.Control type="datetime-local" name="registration_end_date" value={event.registration_end_date} onChange={handleChange} />
              </Form.Group>
              <Form.Group controlId="formRegistrationFee" className="mb-3">
                <Form.Label>Registration Fee</Form.Label>
                <Form.Control type="number" name="registration_fee" value={event.registration_fee} onChange={handleChange} />
              </Form.Group>
              <Form.Group controlId="formAvailableSeat" className="mb-3">
                <Form.Label>Available Seat</Form.Label>
                <Form.Control type="number" name="available_seat" value={event.available_seat} onChange={handleChange} />
              </Form.Group>
              <Form.Group controlId="formEventType" className="mb-3">
                <Form.Label>Event Type</Form.Label>
                <Form.Control as="select" name="event_type" value={event.event_type} onChange={handleChange}>
                  {eventTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formOrganizerName" className="mb-3">
                <Form.Label>Organizer Name</Form.Label>
                <Form.Control as="select" name="organizer_name" value={event.organizer_name} onChange={handleChange}>
                  {eventOrganizers.map((organizer) => (
                    <option key={organizer.id} value={organizer.id}>
                      {organizer.name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="formEventStatus" className="mb-3">
                <Form.Label>Event Status</Form.Label>
                <Form.Control as="select" name="event_status" value={event.event_status} onChange={handleChange}>
                  {eventStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateEvent}>
            <FaSave /> Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UpdateFace;
