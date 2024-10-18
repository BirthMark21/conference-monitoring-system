import React, { useState, useEffect } from "react";
import { Table, Card, Button, Modal, Form, Alert, ButtonGroup } from "react-bootstrap";
import { FaSave, FaPen, FaTrash, FaThList, FaThLarge, FaCalendar, FaClock, FaAlignLeft, FaSortNumericDown, FaUser, FaImage, FaEye } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Agenda = () => {
  const [agendas, setAgendas] = useState([]);
  const [events, setEvents] = useState({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAgenda, setSelectedAgenda] = useState(null);
  const [newAgenda, setNewAgenda] = useState({
    title: "",
    start_time: "",
    end_time: "",
    description: "",
    event_order: "",
    moderator: "",
    image: null,
    events: "",
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [viewMode, setViewMode] = useState("card");

  useEffect(() => {
    fetchAgendas();
    fetchEvents();
  }, []);

  const fetchAgendas = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/agenda/");
      if (response.ok) {
        const data = await response.json();
        setAgendas(data);
      } else {
        console.error("Error fetching agendas:", response.status);
      }
    } catch (error) {
      console.error("Error fetching agendas:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/physical-events/");
      if (response.ok) {
        const data = await response.json();
        const eventsMap = data.reduce((acc, event) => {
          acc[event.id] = event.name;
          return acc;
        }, {});
        setEvents(eventsMap);
      } else {
        console.error("Error fetching events:", response.status);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleAddAgenda = async () => {
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
      } else {
        console.error("Error adding agenda:", response.status);
        showAlert("Error adding agenda", "danger");
      }
    } catch (error) {
      console.error("Error adding agenda:", error);
      showAlert("Error adding agenda", "danger");
    }
  };

  const handleDeleteAgenda = async (agendaId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/agenda/${agendaId}/`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchAgendas();
        showAlert("Agenda deleted successfully!", "success");
      } else {
        console.error("Error deleting agenda:", response.status);
        showAlert("Error deleting agenda", "danger");
      }
    } catch (error) {
      console.error("Error deleting agenda:", error);
      showAlert("Error deleting agenda", "danger");
    }
  };

  const handleUpdateAgenda = (agenda) => {
    setSelectedAgenda(agenda);
    setNewAgenda({
      ...agenda,
      title: agenda.title || "",
      start_time: agenda.start_time || "",
      end_time: agenda.end_time || "",
      description: agenda.description || "",
      event_order: agenda.event_order || "",
      moderator: agenda.moderator || "",
      events: agenda.events || "",
    });
    setShowUpdateModal(true);
  };

  const handleViewAgenda = (agenda) => {
    setSelectedAgenda(agenda);
    setShowViewModal(true);
  };

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

  const handleUpdateSubmit = async () => {
    try {
      const formData = new FormData();
      for (const key in newAgenda) {
        formData.append(key, newAgenda[key]);
      }

      const response = await fetch(`http://127.0.0.1:8000/api/agenda/${newAgenda.id}/`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        fetchAgendas();
        setShowUpdateModal(false);
        showAlert("Agenda updated successfully!", "success");
      } else {
        console.error("Error updating agenda:", response.status);
        showAlert("Error updating agenda", "danger");
      }
    } catch (error) {
      console.error("Error updating agenda:", error);
      showAlert("Error updating agenda", "danger");
    }
  };

  const showAlert = (message, variant) => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setTimeout(() => {
      setAlertMessage("");
    }, 3000);
  };

  const getEventNameById = (eventId) => {
    return events[eventId] || "Unknown Event";
  };

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
      </div>

      <Button variant="primary" onClick={() => setShowAddModal(true)} className="mb-3">
        <FaSave /> Create Agenda
      </Button>

      {viewMode === "card" ? (
        <div className="d-flex flex-wrap">
          {agendas.map((agenda) => (
            <Card key={agenda.id} className="mb-3 me-3" style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Text>
                  <FaCalendar /> {getEventNameById(agenda.events)}
                </Card.Text>
                <Card.Title>{agenda.title}</Card.Title>
                {agenda.image && (
                  <Card.Img variant="top" src={agenda.image} alt="Agenda Image" />
                )}
                <div className="d-flex justify-content-between">
                  <Button variant="outline-info" onClick={() => handleViewAgenda(agenda)}>
                    <FaEye /> View
                  </Button>
                  <Button variant="outline-primary" onClick={() => handleUpdateAgenda(agenda)}>
                    <FaPen /> Edit
                  </Button>
                  <Button variant="outline-danger" onClick={() => handleDeleteAgenda(agenda.id)}>
                    <FaTrash /> Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th><FaSortNumericDown /> #</th>
              <th><FaThLarge /> Event</th>
              <th><FaCalendar /> Agenda Title</th>
              <th><FaClock /> Start Time</th>
              <th><FaClock /> End Time</th>
              <th><FaAlignLeft /> Description</th>
              <th><FaSortNumericDown /> Order</th>
              <th><FaUser /> Moderator</th>
              <th><FaImage /> Image</th>
              <th><FaEye /> Actions</th>
            </tr>
          </thead>
          <tbody>
            {agendas.map((agenda, index) => (
              <tr key={agenda.id}>
                <td>{index + 1}</td>
                <td>{getEventNameById(agenda.events)}</td>
                <td>{agenda.title}</td>
                <td>{agenda.start_time}</td>
                <td>{agenda.end_time}</td>
                <td>{agenda.description}</td>
                <td>{agenda.event_order}</td>
                <td>{agenda.moderator}</td>
                <td>
                  {agenda.image && <img src={agenda.image} alt="Agenda" style={{ width: "50px" }} />}
                </td>
                <td>
                  <Button variant="outline-info" onClick={() => handleViewAgenda(agenda)} size="sm">
                    <FaEye /> View
                  </Button>
                  <Button variant="outline-primary" onClick={() => handleUpdateAgenda(agenda)} size="sm">
                    <FaPen /> Edit
                  </Button>
                  <Button variant="outline-danger" onClick={() => handleDeleteAgenda(agenda.id)} size="sm">
                    <FaTrash /> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Add Agenda Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Agenda</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEvent" className="mb-3">
              <Form.Label><FaThLarge /> Event</Form.Label>
              <Form.Control
                as="select"
                name="events"
                value={newAgenda.events}
                onChange={handleChange}
              >
                <option value="">Select Event</option>
                {Object.entries(events).map(([id, name]) => (
                  <option key={id} value={id}>{name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formTitle" className="mb-3">
              <Form.Label><FaCalendar /> Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newAgenda.title}
                onChange={handleChange}
                placeholder="Enter title"
              />
            </Form.Group>
            <Form.Group controlId="formStartTime" className="mb-3">
              <Form.Label><FaClock /> Start Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="start_time"
                value={newAgenda.start_time}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formEndTime" className="mb-3">
              <Form.Label><FaClock /> End Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="end_time"
                value={newAgenda.end_time}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formDescription" className="mb-3">
              <Form.Label><FaAlignLeft /> Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newAgenda.description}
                onChange={handleChange}
                placeholder="Enter description"
              />
            </Form.Group>
            <Form.Group controlId="formEventOrder" className="mb-3">
              <Form.Label><FaSortNumericDown /> Event Order</Form.Label>
              <Form.Control
                type="number"
                name="event_order"
                value={newAgenda.event_order}
                onChange={handleChange}
                placeholder="Enter event order"
              />
            </Form.Group>
            <Form.Group controlId="formModerator" className="mb-3">
              <Form.Label><FaUser /> Moderator</Form.Label>
              <Form.Control
                type="text"
                name="moderator"
                value={newAgenda.moderator}
                onChange={handleChange}
                placeholder="Enter moderator name"
              />
            </Form.Group>
            <Form.Group controlId="formImage" className="mb-3">
              <Form.Label><FaImage /> Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleImageChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddAgenda}>
            Create Agenda 
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Agenda Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Agenda</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formEvent" className="mb-3">
              <Form.Label><FaThLarge /> Event</Form.Label>
              <Form.Control
                as="select"
                name="events"
                value={newAgenda.events}
                onChange={handleChange}
              >
                <option value="">Select Event</option>
                {Object.entries(events).map(([id, name]) => (
                  <option key={id} value={id}>{name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formTitle" className="mb-3">
              <Form.Label><FaCalendar /> Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newAgenda.title}
                onChange={handleChange}
                placeholder="Enter title"
              />
            </Form.Group>
            <Form.Group controlId="formStartTime" className="mb-3">
              <Form.Label><FaClock /> Start Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="start_time"
                value={newAgenda.start_time}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formEndTime" className="mb-3">
              <Form.Label><FaClock /> End Time</Form.Label>
              <Form.Control
                type="datetime-local"
                name="end_time"
                value={newAgenda.end_time}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formDescription" className="mb-3">
              <Form.Label><FaAlignLeft /> Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={newAgenda.description}
                onChange={handleChange}
                placeholder="Enter description"
              />
            </Form.Group>
            <Form.Group controlId="formEventOrder" className="mb-3">
              <Form.Label><FaSortNumericDown /> Event Order</Form.Label>
              <Form.Control
                type="number"
                name="event_order"
                value={newAgenda.event_order}
                onChange={handleChange}
                placeholder="Enter event order"
              />
            </Form.Group>
            <Form.Group controlId="formModerator" className="mb-3">
              <Form.Label><FaUser /> Moderator</Form.Label>
              <Form.Control
                type="text"
                name="moderator"
                value={newAgenda.moderator}
                onChange={handleChange}
                placeholder="Enter moderator name"
              />
            </Form.Group>
            <Form.Group controlId="formImage" className="mb-3">
              <Form.Label><FaImage /> Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleImageChange}
              />
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

      {/* View Agenda Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>View Agenda</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAgenda && (
            <div>
              <p><FaThLarge /> Event: {getEventNameById(selectedAgenda.events)}</p>
              <p><FaCalendar /> Title: {selectedAgenda.title}</p>
              <p><FaClock /> Start Time: {selectedAgenda.start_time}</p>
              <p><FaClock /> End Time: {selectedAgenda.end_time}</p>
              <p><FaAlignLeft /> Description: {selectedAgenda.description}</p>
              <p><FaSortNumericDown /> Event Order: {selectedAgenda.event_order}</p>
              <p><FaUser /> Moderator: {selectedAgenda.moderator}</p>
              {selectedAgenda.image && (
                <p>
                  <FaImage /> Image: <img src={selectedAgenda.image} alt="Agenda" style={{ width: "100px" }} />
                </p>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Agenda;

