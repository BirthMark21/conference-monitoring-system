import React, { useEffect, useState } from "react";
import { Table, Button, Alert, Card, Form, Row, Col, InputGroup } from "react-bootstrap";
import { FaEdit, FaTrash, FaThList, FaThLarge } from "react-icons/fa";
import TrackEvents from "./TrackEvents";
import EventUpdateTrack from "./EventUpdateTrack";

const EventsDetails = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertVariant, setAlertVariant] = useState("success");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [view, setView] = useState("table");

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [searchTerm, selectedType, events]);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/physical-events/");
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      } else {
        console.error("Error fetching events:", response.status);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleDeleteEvent = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this event?");
    if (confirmDelete) {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/physical-events/${id}/`, {
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
    }
  };

  const handleEditEvent = (event) => {
    const confirmEdit = window.confirm("Are you sure you want to edit this event?");
    if (confirmEdit) {
      setSelectedEvent(event);
      setShowUpdateModal(true);
    }
  };

  const showAlert = (message, variant) => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setTimeout(() => {
      setAlertMessage(null);
    }, 3000);
  };

  const filterEvents = () => {
    let filtered = events;

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter(event => event.event_type === selectedType);
    }

    setFilteredEvents(filtered);
  };

  return (
    <div>
      <TrackEvents fetchEvents={fetchEvents} showAlert={showAlert} />
      {alertMessage && <Alert variant={alertVariant}>{alertMessage}</Alert>}
      
      <Row className="mb-3">
        <Col md={4}>
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Col>
        <Col md={2}>
          <Form.Control
            as="select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">All Types</option>
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
        </Col>
        <Col md={4} className="text-right">
          <Button variant={view === "table" ? "primary" : "secondary"} onClick={() => setView("table")} size="sm">
            <FaThList /> Table View
          </Button>{" "}
          <Button variant={view === "card" ? "primary" : "secondary"} onClick={() => setView("card")} size="sm">
            <FaThLarge /> Card View
          </Button>
        </Col>
      </Row>

      {view === "table" ? (
        <div className="table-responsive">
          <Table striped bordered hover className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>Event Name</th>
                <th className="d-none d-sm-table-cell">Description</th>
                <th>Date</th>
                <th className="d-none d-sm-table-cell">Location</th>
                <th className="d-none d-md-table-cell">Registration Start Date</th>
                <th className="d-none d-md-table-cell">Registration End Date</th>
                <th className="d-none d-md-table-cell">Registration Fee</th>
                <th>Available Seats</th>
                <th>Event Type</th>
                <th className="d-none d-sm-table-cell">Organizer Name</th>
                <th className="d-none d-md-table-cell">Organizer Contact</th>
                <th className="d-none d-sm-table-cell">Target Audience</th>
                <th className="d-none d-md-table-cell">Keywords</th>
                <th>Event Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event.id}>
                  <td>{event.id}</td>
                  <td>{event.name}</td>
                  <td className="d-none d-sm-table-cell">{event.description}</td>
                  <td>{event.date}</td>
                  <td className="d-none d-sm-table-cell">{event.location}</td>
                  <td className="d-none d-md-table-cell">{event.registration_start_date}</td>
                  <td className="d-none d-md-table-cell">{event.registration_end_date}</td>
                  <td className="d-none d-md-table-cell">{event.registration_fee}</td>
                  <td>{event.available_seat}</td>
                  <td>{event.event_type}</td>
                  <td className="d-none d-sm-table-cell">{event.organizer_name}</td>
                  <td className="d-none d-md-table-cell">{event.organizer_contact}</td>
                  <td className="d-none d-sm-table-cell">{event.target_audience}</td>
                  <td className="d-none d-md-table-cell">{event.keywords}</td>
                  <td>{event.event_status}</td>
                  <td>
                    <Button variant="info" size="sm" onClick={() => handleEditEvent(event)}>
                      <FaEdit /> Edit
                    </Button>{" "}
                    <Button variant="danger" size="sm" onClick={() => handleDeleteEvent(event.id)}>
                      <FaTrash /> Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <Row>
          {filteredEvents.map((event) => (
            <Col md={4} key={event.id} className="mb-3">
              <Card>
                {event.banner_image && <Card.Img variant="top" src={`http://127.0.0.1:8000${event.banner_image}`} />}
                <Card.Body>
                  <Card.Title>{event.name}</Card.Title>
                  <Card.Text>
                    Location: {event.location}
                    <br />
                    Price: {event.registration_fee}
                  </Card.Text>
                  <Button variant="info" size="sm" onClick={() => handleEditEvent(event)}>
                    <FaEdit /> Edit
                  </Button>{" "}
                  <Button variant="danger" size="sm" onClick={() => handleDeleteEvent(event.id)}>
                    <FaTrash /> Delete
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {selectedEvent && (
        <EventUpdateTrack
          selectedEvent={selectedEvent}
          fetchEvents={fetchEvents}
          showAlert={showAlert}
          setShowUpdateModal={setShowUpdateModal}
          showUpdateModal={showUpdateModal}
        />
      )}
    </div>
  );
};

export default EventsDetails;
