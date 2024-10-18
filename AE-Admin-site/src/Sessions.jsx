import React, { useState, useEffect } from "react";
import { Table, Card, Button, Modal, Form, Alert, ButtonGroup } from "react-bootstrap";
import { FaEye, FaPen, FaTrash, FaSave, FaThLarge, FaThList, FaCalendarAlt, FaTag } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Sessions = () => {
  const [sessions, setSessions] = useState([]);
  const [events, setEvents] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [newSession, setNewSession] = useState({
    event_sessions: "",
    title: "",
    description: "",
    moderator: "",
    start_time: "",
    end_time: "",
    duration: "",
    location: "",
    format: "",
    objectives: "",
    notes: "",
    image: null,
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [viewMode, setViewMode] = useState("table");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchSessions();
    fetchEvents();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/sessions/");
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      } else {
        console.error("Error fetching sessions:", response.status);
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

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

  const handleAddSession = async () => {
    try {
      const formData = new FormData();
      for (const key in newSession) {
        formData.append(key, newSession[key]);
      }

      const response = await fetch("http://127.0.0.1:8000/api/sessions/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        fetchSessions();
        setShowAddModal(false);
        showAlert("Session added successfully!", "success");
      } else {
        console.error("Error adding session:", response.status);
        showAlert("Error adding session", "danger");
      }
    } catch (error) {
      console.error("Error adding session:", error);
      showAlert("Error adding session", "danger");
    }
  };

  const handleDeleteSession = async (sessionId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/sessions/${sessionId}/`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchSessions();
        showAlert("Session deleted successfully!", "success");
      } else {
        console.error("Error deleting session:", response.status);
        showAlert("Error deleting session", "danger");
      }
    } catch (error) {
      console.error("Error deleting session:", error);
      showAlert("Error deleting session", "danger");
    }
  };

  const handleUpdateSession = (session) => {
    setSelectedSession(session);
    setNewSession({
      ...session,
      duration: session.duration || "",
    });
    setShowUpdateModal(true);
  };

  const handleDetailView = (session) => {
    setSelectedSession(session);
    setShowDetailModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSession((prevSession) => ({
      ...prevSession,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewSession((prevSession) => ({
        ...prevSession,
        image: file,
      }));
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      const formData = new FormData();
      for (const key in newSession) {
        formData.append(key, newSession[key]);
      }

      const response = await fetch(`http://127.0.0.1:8000/api/sessions/${newSession.id}/`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        fetchSessions();
        setShowUpdateModal(false);
        showAlert("Session updated successfully!", "success");
      } else {
        console.error("Error updating session:", response.status);
        showAlert("Error updating session", "danger");
      }
    } catch (error) {
      console.error("Error updating session:", error);
      showAlert("Error updating session", "danger");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredSessions = sessions.filter((session) =>
    (session.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Form.Control
          type="text"
          placeholder="Search Sessions..."
          value={searchQuery}
          onChange={handleSearch}
          className="me-2"
        />
        <ButtonGroup>
          <Button variant="outline-primary" onClick={() => setViewMode("card")}>
            <FaThLarge /> Card View
          </Button>
          <Button variant="outline-primary" onClick={() => setViewMode("table")}>
            <FaThList /> Table View
          </Button>
        </ButtonGroup>
      </div>

      <Button variant="primary" onClick={() => setShowAddModal(true)} className="mb-3">
        <FaSave /> Add Session
      </Button>

      {viewMode === "table" ? (
        <div style={{ overflowX: "auto" }}>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Moderator</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Duration</th>
                <th>Location</th>
                <th>Format</th>
                <th>Objectives</th>
                <th>Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((session) => (
                <tr key={session.id}>
                  <td>{session.title}</td>
                  <td>{session.description}</td>
                  <td>{session.moderator}</td>
                  <td>{session.start_time}</td>
                  <td>{session.end_time}</td>
                  <td>{session.duration}</td>
                  <td>{session.location}</td>
                  <td>{session.format}</td>
                  <td>{session.objectives}</td>
                  <td>{session.notes}</td>
                  <td>
                    <ButtonGroup>
                      <Button variant="outline-primary" onClick={() => handleDetailView(session)}>
                        <FaEye />
                      </Button>
                      <Button variant="outline-secondary" onClick={() => handleUpdateSession(session)}>
                        <FaPen />
                      </Button>
                      <Button variant="outline-danger" onClick={() => handleDeleteSession(session.id)}>
                        <FaTrash />
                      </Button>
                    </ButtonGroup>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <div className="d-flex flex-wrap">
          {filteredSessions.map((session) => (
            <Card key={session.id} className="m-2" style={{ width: '18rem' }}>
              <Card.Body>
                <Card.Title>
                  <FaCalendarAlt /> {session.event_name}
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted mt-2">
                  <FaTag /> {session.title}
                </Card.Subtitle>
                {session.image && <Card.Img variant="top" src={session.image} alt="Session Image" className="mt-2" />}
                <Card.Text>Moderator: {session.moderator}</Card.Text>
                <Card.Text>Start Time: {session.start_time}</Card.Text>
                <Card.Text>End Time: {session.end_time}</Card.Text>
                <Card.Text>Duration: {session.duration}</Card.Text>
                <Card.Text>Location: {session.location}</Card.Text>
                <Card.Text>Format: {session.format}</Card.Text>
                <Card.Text>Objectives: {session.objectives}</Card.Text>
                <Card.Text>Notes: {session.notes}</Card.Text>
                <ButtonGroup>
                  <Button variant="outline-primary" onClick={() => handleDetailView(session)}>
                    <FaEye /> View
                  </Button>
                  <Button variant="outline-secondary" onClick={() => handleUpdateSession(session)}>
                    <FaPen /> Edit
                  </Button>
                  <Button variant="outline-danger" onClick={() => handleDeleteSession(session.id)}>
                    <FaTrash /> Delete
                  </Button>
                </ButtonGroup>
              </Card.Body>
            </Card>
          ))}
        </div>
      )}

      {/* Add Session Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Session For Four Agenda</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEventSessions">
              <Form.Label>Event</Form.Label>
              <Form.Control
                as="select"
                name="event_sessions"
                value={newSession.event_sessions}
                onChange={handleChange}
                required
              >
                <option value="">Select Event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            {["title", "description", "moderator", "start_time", "end_time", "duration", "location", "format", "objectives", "notes"].map((field) => (
              <Form.Group controlId={`form${field}`} key={field}>
                <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                <Form.Control
                  type={field.includes("time") || field === "duration" ? "time" : "text"}
                  name={field}
                  value={newSession[field]}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            ))}
            <Form.Group controlId="formImage">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} required />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddSession}>
            Create Sessions
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Session Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Session</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEventSessions">
              <Form.Label>Event</Form.Label>
              <Form.Control
                as="select"
                name="event_sessions"
                value={newSession.event_sessions}
                onChange={handleChange}
                required
              >
                <option value="">Select Event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            {["title", "description", "moderator", "start_time", "end_time", "duration", "location", "format", "objectives", "notes"].map((field) => (
              <Form.Group controlId={`form${field}`} key={field}>
                <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
                <Form.Control
                  type={field.includes("time") || field === "duration" ? "time" : "text"}
                  name={field}
                  value={newSession[field]}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            ))}
            <Form.Group controlId="formImage">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} required />
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

      {/* Detail View Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Session Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSession && (
            <Card>
              <Card.Body>
                <Card.Title>
                  <FaCalendarAlt /> {selectedSession.event_name}
                </Card.Title>
                <Card.Subtitle className="mb-2 text-muted mt-2">
                  <FaTag /> {selectedSession.title}
                </Card.Subtitle>
                {selectedSession.image && <Card.Img variant="top" src={selectedSession.image} alt="Session Image" />}
                <Card.Text>Moderator: {selectedSession.moderator}</Card.Text>
                <Card.Text>Start Time: {selectedSession.start_time}</Card.Text>
                <Card.Text>End Time: {selectedSession.end_time}</Card.Text>
                <Card.Text>Duration: {selectedSession.duration}</Card.Text>
                <Card.Text>Location: {selectedSession.location}</Card.Text>
                <Card.Text>Format: {selectedSession.format}</Card.Text>
                <Card.Text>Objectives: {selectedSession.objectives}</Card.Text>
                <Card.Text>Notes: {selectedSession.notes}</Card.Text>
              </Card.Body>
            </Card>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Sessions;
