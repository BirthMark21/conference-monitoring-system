import React, { useState, useEffect } from "react";
import { Table, Card, Button, Modal, Form, Alert, ButtonGroup, DropdownButton, Dropdown } from "react-bootstrap";
import { FaSave, FaPen, FaTrash, FaThList, FaThLarge, FaEye, FaCalendar, FaClock, FaCalendarAlt, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import axios from "axios";
//import "bootstrap/dist/css/bootstrap.min.css";

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    name: "",
    description: "",
    banner_image: null,
    date: "",
    location: "",
    registration_start_date: "",
    registration_end_date: "",
    registration_fee: "",
    available_seat: "",
    event_type: "Conference",
    organizer_name: "",
    organizer_contact: "",
    target_audience: "",
    keywords: "",
    event_status: "Scheduled",
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [viewMode, setViewMode] = useState("card");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [events, filterType, filterStatus, searchQuery]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/physical-events/");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleAddEvent = async () => {
    try {
      const formData = new FormData();
      for (const key in newEvent) {
        formData.append(key, newEvent[key]);
      }

      await axios.post("http://127.0.0.1:8000/api/physical-events/", formData);
      fetchEvents();
      setShowAddModal(false);
      showAlert("Event added successfully!", "success");
    } catch (error) {
      console.error("Error adding event:", error);
      showAlert("Error adding event", "danger");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/physical-events/${eventId}/`);
      fetchEvents();
      showAlert("Event deleted successfully!", "success");
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
      banner_image: event.banner_image || null,
      date: event.date || "",
      location: event.location || "",
      registration_start_date: event.registration_start_date || "",
      registration_end_date: event.registration_end_date || "",
      registration_fee: event.registration_fee || "",
      available_seat: event.available_seat || "",
      event_type: event.event_type || "Conference",
      organizer_name: event.organizer_name || "",
      organizer_contact: event.organizer_contact || "",
      target_audience: event.target_audience || "",
      keywords: event.keywords || "",
      event_status: event.event_status || "Scheduled",
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
    try {
      const formData = new FormData();
      for (const key in newEvent) {
        formData.append(key, newEvent[key]);
      }

      await axios.put(`http://127.0.0.1:8000/api/physical-events/${newEvent.id}/`, formData);
      fetchEvents();
      setShowUpdateModal(false);
      showAlert("Event updated successfully!", "success");
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

  const applyFilters = () => {
    let filtered = events;

    if (filterType) {
      filtered = filtered.filter(event => event.event_type === filterType);
    }

    if (filterStatus) {
      filtered = filtered.filter(event => event.event_status === filterStatus);
    }

    if (searchQuery) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.event_type.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  };

  return (
    <div className="exee">
      {alertMessage && (
        <Alert variant={alertVariant} className="text-center">
          {alertMessage}
        </Alert>
      )}

      <div className="ababa ">
      {/* <DropdownButton id="top-dropdown" title="Menu">
          <Dropdown.Item href="/agendamanager">Manage Agendas </Dropdown.Item>
          <Dropdown.Item href="/sessions">Manage Sessions </Dropdown.Item>
          <Dropdown.Item href="/schedules">Manage Schedules</Dropdown.Item>
        </DropdownButton> */}
        <ButtonGroup className="ms-auto">
          <Button variant="outline-primary" onClick={() => setViewMode("card")}>
            <FaThLarge /> Card View
          </Button>
          <Button variant="outline-primary" onClick={() => setViewMode("table")}>
            <FaThList /> Table View
          </Button>
        </ButtonGroup>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <DropdownButton id="filter-type" title={`Filter by Type: ${filterType || "All"}`} onSelect={setFilterType}>
          <Dropdown.Item eventKey="">All</Dropdown.Item>
          {eventTypes.map(type => (
            <Dropdown.Item key={type} eventKey={type}>{type}</Dropdown.Item>
          ))}
        </DropdownButton>

        <DropdownButton id="filter-status" title={`Filter by Status: ${filterStatus || "All"}`} onSelect={setFilterStatus}>
          <Dropdown.Item eventKey="">All</Dropdown.Item>
          {eventStatuses.map(status => (
            <Dropdown.Item key={status} eventKey={status}>{status}</Dropdown.Item>
          ))}
        </DropdownButton>

        <Form.Control
          type="text"
          placeholder="Search by Name, Location, Event Type"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      {viewMode === "card" ? (
        <div className="d-flex flex-wrap">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="mb-3 me-3" style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title> <FaCalendar />{event.name}</Card.Title>
                {event.banner_image && <Card.Img variant="top" src={event.banner_image} alt="Event Banner" />}
                <Card.Text><FaMapMarkerAlt /> {event.location}</Card.Text>
                <div className="d-flex justify-content-between">
                  <Button variant="outline-primary" onClick={() => handleViewEvent(event)}>
                    <FaEye /> View
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Banner Image</th>
                <th>Date</th>
                <th>Location</th>
                <th>Registration Start Date</th>
                <th>Registration End Date</th>
                <th>Registration Fee</th>
                <th>Available Seats</th>
                <th>Event Type</th>
                <th>Organizer Name</th>
                <th>Organizer Contact</th>
                <th>Target Audience</th>
                <th>Keywords</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map(event => (
                <tr key={event.id}>
                  <td>{event.id}</td>
                  <td>{event.name}</td>
                  <td>{event.description}</td>
                  <td>
                    {event.banner_image && (
                      <img src={event.banner_image} alt="Banner" style={{ width: "50px", height: "50px" }} />
                    )}
                  </td>
                  <td>{event.date}</td>
                  <td>{event.location}</td>
                  <td>{event.registration_start_date}</td>
                  <td>{event.registration_end_date}</td>
                  <td>{event.registration_fee}</td>
                  <td>{event.available_seat}</td>
                  <td>{event.event_type}</td>
                  <td>{event.organizer_name}</td>
                  <td>{event.organizer_contact}</td>
                  <td>{event.target_audience}</td>
                  <td>{event.keywords}</td>
                  <td>{event.event_status}</td>
                  <td>
                    <Button variant="outline-primary" onClick={() => handleViewEvent(event)}>
                      <FaEye /> View
                    </Button>
                    <Button variant="outline-secondary" onClick={() => handleUpdateEvent(event)}>
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
        </div>
      )}

      {/* Add Event Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={newEvent.name} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" rows={3} name="description" value={newEvent.description} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formBannerImage">
              <Form.Label>Banner Image</Form.Label>
              <Form.Control type="file" name="banner_image" onChange={handleImageChange} />
            </Form.Group>
            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control type="date" name="date" value={newEvent.date} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control type="text" name="location" value={newEvent.location} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formRegistrationStartDate">
              <Form.Label>Registration Start Date</Form.Label>
              <Form.Control type="date" name="registration_start_date" value={newEvent.registration_start_date} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formRegistrationEndDate">
              <Form.Label>Registration End Date</Form.Label>
              <Form.Control type="date" name="registration_end_date" value={newEvent.registration_end_date} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formRegistrationFee">
              <Form.Label>Registration Fee</Form.Label>
              <Form.Control type="number" name="registration_fee" value={newEvent.registration_fee} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formAvailableSeat">
              <Form.Label>Available Seats</Form.Label>
              <Form.Control type="number" name="available_seat" value={newEvent.available_seat} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formEventType">
              <Form.Label>Event Type</Form.Label>
              <Form.Control as="select" name="event_type" value={newEvent.event_type} onChange={handleChange}>
                {eventTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formOrganizerName">
              <Form.Label>Organizer Name</Form.Label>
              <Form.Control type="text" name="organizer_name" value={newEvent.organizer_name} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formOrganizerContact">
              <Form.Label>Organizer Contact</Form.Label>
              <Form.Control type="text" name="organizer_contact" value={newEvent.organizer_contact} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formTargetAudience">
              <Form.Label>Target Audience</Form.Label>
              <Form.Control type="text" name="target_audience" value={newEvent.target_audience} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formKeywords">
              <Form.Label>Keywords</Form.Label>
              <Form.Control type="text" name="keywords" value={newEvent.keywords} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formEventStatus">
              <Form.Label>Event Status</Form.Label>
              <Form.Control as="select" name="event_status" value={newEvent.event_status} onChange={handleChange}>
                {eventStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddEvent}>Add Event</Button>
        </Modal.Footer>
      </Modal>

      {/* Update Event Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Event Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newEvent.name}
                onChange={handleChange}
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
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Banner Image</Form.Label>
              <Form.Control
                type="file"
                name="banner_image"
                onChange={handleImageChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
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
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Registration Start Date</Form.Label>
              <Form.Control
                type="date"
                name="registration_start_date"
                value={newEvent.registration_start_date}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Registration End Date</Form.Label>
              <Form.Control
                type="date"
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
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Available Seats</Form.Label>
              <Form.Control
                type="number"
                name="available_seat"
                value={newEvent.available_seat}
                onChange={handleChange}
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
                {eventTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Organizer Name</Form.Label>
              <Form.Control
                type="text"
                name="organizer_name"
                value={newEvent.organizer_name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Organizer Contact</Form.Label>
              <Form.Control
                type="text"
                name="organizer_contact"
                value={newEvent.organizer_contact}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Target Audience</Form.Label>
              <Form.Control
                type="text"
                name="target_audience"
                value={newEvent.target_audience}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Keywords</Form.Label>
              <Form.Control
                type="text"
                name="keywords"
                value={newEvent.keywords}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Event Status</Form.Label>
              <Form.Control
                as="select"
                name="event_status"
                value={newEvent.event_status}
                onChange={handleChange}
              >
                {eventStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* View Event Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>View Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <div>
              <h5><FaCalendar /> {selectedEvent.name}</h5>
              {selectedEvent.banner_image && <img src={selectedEvent.banner_image} alt="Event Banner" style={{ width: "100%" }} />}
              <p><FaCalendarAlt /> Date: {selectedEvent.date}</p>
              <p><FaMapMarkerAlt /> Location: {selectedEvent.location}</p>
              <p><FaUsers /> Audience: {selectedEvent.target_audience}</p>
              <p><FaClock /> Registration Period: {selectedEvent.registration_start_date} to {selectedEvent.registration_end_date}</p>
              <p>Fee: {selectedEvent.registration_fee}</p>
              <p>Seats: {selectedEvent.available_seat}</p>
              <p>Type: {selectedEvent.event_type}</p>
              <p>Organizer: {selectedEvent.organizer_name}</p>
              <p>Contact: {selectedEvent.organizer_contact}</p>
              <p>Status: {selectedEvent.event_status}</p>
              <p>Keywords: {selectedEvent.keywords}</p>
              <p>Description: {selectedEvent.description}</p>
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

export default FaceEvents;
