import React, { useState, useEffect } from "react";
import { Table, Card, Button, Modal, Form, Alert, ButtonGroup, Dropdown } from "react-bootstrap";
import { FaSave, FaPen, FaTrash, FaThList, FaThLarge, FaAlignLeft, FaSortNumericDown, FaDollarSign, FaCalendarAlt, FaMapMarkerAlt, FaEye, FaTags, FaImage } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const eventTypes = [
  "Conference", "Workshop", "Seminar", "Meetup", "Lecture", "Training",
  "Networking", "Exhibition", "Competition", "Webinar", "Party", "Festival",
  "Concert", "Trade Show", "Launch Event", "Social Event", "Sports Event",
  "Charity Event", "Fundraiser", "Panel Discussion", "Virtual Event", "Gala", "Retreat"
];

const eventStatuses = ["Scheduled", "Postponed", "Cancelled", "Completed"];

const FaceEvents = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    date: "",
    location: "",
    registration_start_date: "",
    registration_end_date: "",
    registration_fee: "",
    available_seat: "",
    event_type: eventTypes[0],
    event_status: eventStatuses[0],
    banner_image: null,
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [viewMode, setViewMode] = useState("card");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/physical-events/");
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
        setFilteredEvents(data);
      } else {
        console.error("Error fetching events:", response.status);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const getStatusCounts = () => {
    const statusCounts = events.reduce((acc, event) => {
      acc[event.event_status] = (acc[event.event_status] || 0) + 1;
      return acc;
    }, {});
    return statusCounts;
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    if (status) {
      setFilteredEvents(events.filter(event => event.event_status === status));
    } else {
      setFilteredEvents(events);
    }
  };

  const handleAddEvent = async () => {
    if (!validateForm()) return;

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

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/physical-events/${eventId}/`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchEvents();
        showAlert("Event deleted successfully!", "success");
      } else {
        console.error("Error deleting event:", response.status);
        showAlert("Error deleting event", "danger");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      showAlert("Error deleting event", "danger");
    }
  };

  const handleUpdateEvent = (event) => {
    setSelectedEvent(event);
    setNewEvent({
      ...event,
      name: event.name || "",
      description: event.description || "",
      date: event.date || "",
      location: event.location || "",
      registration_start_date: event.registration_start_date || "",
      registration_end_date: event.registration_end_date || "",
      registration_fee: event.registration_fee || "",
      available_seat: event.available_seat || "",
      event_type: event.event_type || eventTypes[0],
      event_status: event.event_status || eventStatuses[0],
    });
    setShowUpdateModal(true);
  };

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setShowViewModal(true);
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

  const handleUpdateSubmit = async () => {
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      for (const key in newEvent) {
        formData.append(key, newEvent[key]);
      }

      const response = await fetch(`http://127.0.0.1:8000/api/physical-events/${newEvent.id}/`, {
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

  const showAlert = (message, variant) => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setTimeout(() => {
      setAlertMessage("");
    }, 3000);
  };

  const validateForm = () => {
    if (!newEvent.name || !newEvent.date || !newEvent.location || !newEvent.registration_fee || !newEvent.available_seat || !newEvent.event_type || !newEvent.event_status) {
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
            {eventStatuses.map(status => (
              <Dropdown.Item key={status} onClick={() => handleFilterChange(status)}>
                {status} ({statusCounts[status.toLowerCase()] || 0})
              </Dropdown.Item>
            ))}
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => setShowAddModal(true)}>
              <FaSave /> Add Event
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {viewMode === "card" ? (
        <div className="d-flex flex-wrap">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="mb-3 me-3" style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title>{event.name}</Card.Title>
                {event.banner_image && (
                  <Card.Img variant="top" src={event.banner_image} alt="Event Banner" />
                )}
                <Card.Text>{event.description}</Card.Text>
                <Card.Text><FaCalendarAlt /> {new Date(event.date).toLocaleString()}</Card.Text>
                <Card.Text><FaMapMarkerAlt /> {event.location}</Card.Text>
                <Card.Text><FaDollarSign /> {event.registration_fee}</Card.Text>
                <div className="d-flex justify-content-between">
                  <Button variant="outline-info" onClick={() => handleViewEvent(event)}>
                    <FaEye /> View
                  </Button>
                  <Button variant="outline-success" onClick={() => handleUpdateEvent(event)}>
                    <FaPen /> Edit
                  </Button>
                  <Button variant="outline-danger" onClick={() => handleDeleteEvent(event.id)}>
                    <FaTrash /> Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th><FaAlignLeft /> Name</th>
              <th><FaSortNumericDown /> Description</th>
              <th><FaCalendarAlt /> Date</th>
              <th><FaMapMarkerAlt /> Location</th>
              <th><FaCalendarAlt /> Registration Start Date</th>
              <th><FaCalendarAlt /> Registration End Date</th>
              <th><FaDollarSign /> Registration Fee</th>
              <th><FaSortNumericDown /> Available Seats</th>
              <th><FaTags /> Event Type</th>
              <th><FaTags /> Event Status</th>
              <th><FaImage /> Banner Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map(event => (
              <tr key={event.id}>
                <td>{event.name}</td>
                <td>{event.description}</td>
                <td>{new Date(event.date).toLocaleString()}</td>
                <td>{event.location}</td>
                <td>{new Date(event.registration_start_date).toLocaleString()}</td>
                <td>{new Date(event.registration_end_date).toLocaleString()}</td>
                <td>{event.registration_fee}</td>
                <td>{event.available_seat}</td>
                <td>{event.event_type}</td>
                <td>{event.event_status}</td>
                <td>{event.banner_image && <img src={event.banner_image} alt="Event Banner" width="100" />}</td>
                <td>
                  <Button variant="outline-info" onClick={() => handleViewEvent(event)}>
                    <FaEye /> View
                  </Button>
                  <Button variant="outline-success" onClick={() => handleUpdateEvent(event)}>
                    <FaPen /> Edit
                  </Button>
                  <Button variant="outline-danger" onClick={() => handleDeleteEvent(event.id)}>
                    <FaTrash /> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newEvent.name}
                onChange={handleChange}
                placeholder="Enter event name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newEvent.description}
                onChange={handleChange}
                placeholder="Enter event description"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="datetime-local"
                name="date"
                value={newEvent.date}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={newEvent.location}
                onChange={handleChange}
                placeholder="Enter event location"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Registration Start Date</Form.Label>
              <Form.Control
                type="datetime-local"
                name="registration_start_date"
                value={newEvent.registration_start_date}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Registration End Date</Form.Label>
              <Form.Control
                type="datetime-local"
                name="registration_end_date"
                value={newEvent.registration_end_date}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Registration Fee</Form.Label>
              <Form.Control
                type="number"
                name="registration_fee"
                value={newEvent.registration_fee}
                onChange={handleChange}
                placeholder="Enter registration fee"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Available Seats</Form.Label>
              <Form.Control
                type="number"
                name="available_seat"
                value={newEvent.available_seat}
                onChange={handleChange}
                placeholder="Enter available seats"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Event Type</Form.Label>
              <Form.Control
                as="select"
                name="event_type"
                value={newEvent.event_type}
                onChange={handleChange}
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Event Status</Form.Label>
              <Form.Control
                as="select"
                name="event_status"
                value={newEvent.event_status}
                onChange={handleChange}
              >
                {eventStatuses.map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Banner Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                name="banner_image"
                onChange={handleImageChange}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAddEvent}>
              Add Event
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newEvent.name}
                onChange={handleChange}
                placeholder="Enter event name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newEvent.description}
                onChange={handleChange}
                placeholder="Enter event description"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="datetime-local"
                name="date"
                value={newEvent.date}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={newEvent.location}
                onChange={handleChange}
                placeholder="Enter event location"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Registration Start Date</Form.Label>
              <Form.Control
                type="datetime-local"
                name="registration_start_date"
                value={newEvent.registration_start_date}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Registration End Date</Form.Label>
              <Form.Control
                type="datetime-local"
                name="registration_end_date"
                value={newEvent.registration_end_date}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Registration Fee</Form.Label>
              <Form.Control
                type="number"
                name="registration_fee"
                value={newEvent.registration_fee}
                onChange={handleChange}
                placeholder="Enter registration fee"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Available Seats</Form.Label>
              <Form.Control
                type="number"
                name="available_seat"
                value={newEvent.available_seat}
                onChange={handleChange}
                placeholder="Enter available seats"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Event Type</Form.Label>
              <Form.Control
                as="select"
                name="event_type"
                value={newEvent.event_type}
                onChange={handleChange}
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-
ChatGPT
3">
<Form.Label>Event Status</Form.Label>
<Form.Control
as="select"
name="event_status"
value={newEvent.event_status}
onChange={handleChange}
>
{eventStatuses.map((status) => (
<option key={status} value={status}>{status}</option>
))}
</Form.Control>
</Form.Group>
<Form.Group className="mb-3">
<Form.Label>Banner Image</Form.Label>
<Form.Control
type="file"
accept="image/*"
name="banner_image"
onChange={handleImageChange}
/>
</Form.Group>
<Button variant="primary" onClick={handleUpdateEvent}>
Update Event
</Button>
</Form>
</Modal.Body>
</Modal>

<Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>View Event</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {selectedEvent && (
      <div>
        <p><strong>Name:</strong> {selectedEvent.name}</p>
        <p><strong>Description:</strong> {selectedEvent.description}</p>
        <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleString()}</p>
        <p><strong>Location:</strong> {selectedEvent.location}</p>
        <p><strong>Registration Start Date:</strong> {new Date(selectedEvent.registration_start_date).toLocaleString()}</p>
        <p><strong>Registration End Date:</strong> {new Date(selectedEvent.registration_end_date).toLocaleString()}</p>
        <p><strong>Registration Fee:</strong> {selectedEvent.registration_fee}</p>
        <p><strong>Available Seats:</strong> {selectedEvent.available_seat}</p>
        <p><strong>Event Type:</strong> {selectedEvent.event_type}</p>
        <p><strong>Event Status:</strong> {selectedEvent.event_status}</p>
        {selectedEvent.banner_image && <img src={selectedEvent.banner_image} alt="Event Banner" width="100%" />}
      </div>
    )}
  </Modal.Body>
</Modal>
</div>
);
};

export default FaceEvents;