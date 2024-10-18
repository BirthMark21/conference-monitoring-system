import React, { useState, useEffect } from "react";
import { Table, Card, Button, Modal, Form, Alert, ButtonGroup } from "react-bootstrap";
import { FaSave, FaPen, FaTrash, FaThList, FaThLarge, FaUser, FaEnvelope, FaPhone, FaImage, FaBriefcase } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const ROLE_CHOICES = [
  { value: 'PLENARY', label: 'Plenary Speaker' },
  { value: 'INDUSTRY', label: 'Industry Speaker' },
  { value: 'ACADEMIC', label: 'Academic Speaker' },
  { value: 'INVITED', label: 'Invited Speaker' },
  { value: 'LIGHT_TALKING', label: 'Light Talking Speaker' },
];

const STATUS_CHOICES = [
  { value: 'FREE', label: 'Free' },
  { value: 'BUSY', label: 'Busy' },
];

const Speakers = () => {
  const [speakers, setSpeakers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [newSpeaker, setNewSpeaker] = useState({
    fullname: "",
    organization: "",
    role: "",
    status: "",
    bio: "",
    email: "",
    phone_number: "",
    image: null,
    expertise: "",
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [viewMode, setViewMode] = useState("card");

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const fetchSpeakers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/speakers/");
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

  const handleAddSpeaker = async () => {
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      for (const key in newSpeaker) {
        formData.append(key, newSpeaker[key]);
      }

      const response = await fetch("http://127.0.0.1:8000/api/speakers/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        fetchSpeakers();
        setShowAddModal(false);
        showAlert("Speaker added successfully!", "success");
      } else {
        console.error("Error adding speaker:", response.status);
        showAlert("Error adding speaker", "danger");
      }
    } catch (error) {
      console.error("Error adding speaker:", error);
      showAlert("Error adding speaker", "danger");
    }
  };

  const handleDeleteSpeaker = async (speakerId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/speakers/${speakerId}/`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchSpeakers();
        showAlert("Speaker deleted successfully!", "success");
      } else {
        console.error("Error deleting speaker:", response.status);
        showAlert("Error deleting speaker", "danger");
      }
    } catch (error) {
      console.error("Error deleting speaker:", error);
      showAlert("Error deleting speaker", "danger");
    }
  };

  const handleUpdateSpeaker = (speaker) => {
    setSelectedSpeaker(speaker);
    setNewSpeaker({
      ...speaker,
      fullname: speaker.fullname || "",
      organization: speaker.organization || "",
      role: speaker.role || "",
      status: speaker.status || "",
      bio: speaker.bio || "",
      email: speaker.email || "",
      phone_number: speaker.phone_number || "",
      expertise: speaker.expertise || "",
    });
    setShowUpdateModal(true);
  };

  const handleViewSpeaker = (speaker) => {
    setSelectedSpeaker(speaker);
    setShowViewModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSpeaker((prevSpeaker) => ({
      ...prevSpeaker,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewSpeaker((prevSpeaker) => ({
        ...prevSpeaker,
        image: file,
      }));
    }
  };

  const handleUpdateSubmit = async () => {
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      for (const key in newSpeaker) {
        formData.append(key, newSpeaker[key]);
      }

      const response = await fetch(`http://127.0.0.1:8000/api/speakers/${selectedSpeaker.id}/`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        fetchSpeakers();
        setShowUpdateModal(false);
        showAlert("Speaker updated successfully!", "success");
      } else {
        console.error("Error updating speaker:", response.status);
        showAlert("Error updating speaker", "danger");
      }
    } catch (error) {
      console.error("Error updating speaker:", error);
      showAlert("Error updating speaker", "danger");
    }
  };

  const validateForm = () => {
    if (!newSpeaker.fullname) {
      showAlert("Full name is required", "danger");
      return false;
    }
    if (newSpeaker.email && !/\S+@\S+\.\S+/.test(newSpeaker.email)) {
      showAlert("Invalid email format", "danger");
      return false;
    }
    if (newSpeaker.phone_number && !/^\d{10,15}$/.test(newSpeaker.phone_number)) {
      showAlert("Phone number should be 10 to 15 digits", "danger");
      return false;
    }
    return true;
  };

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
        <FaSave /> Add Speaker
      </Button>

      {viewMode === "card" ? (
        <div className="d-flex flex-wrap">
          {speakers.map((speaker) => (
            <Card key={speaker.id} className="mb-3 me-3" style={{ width: "20rem" }}>
              <Card.Body>
                <Card.Title>{speaker.fullname}</Card.Title>
                <Card.Text><FaBriefcase /> {speaker.organization}</Card.Text>
                {speaker.image && (
                  <Card.Img variant="top" src={speaker.image} alt="Speaker Image" />
                )}
                <div className="d-flex justify-content-between">
                  <Button variant="outline-info" onClick={() => handleViewSpeaker(speaker)}>
                    <FaUser /> View
                  </Button>
                  <Button variant="outline-primary" onClick={() => handleUpdateSpeaker(speaker)}>
                    <FaPen /> Edit
                  </Button>
                  <Button variant="outline-danger" onClick={() => handleDeleteSpeaker(speaker.id)}>
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
              <th>#</th>
              <th>Full Name</th>
              <th>Organization</th>
              <th>Role</th>
              <th>Status</th>
              <th>Bio</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Expertise</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {speakers.map((speaker, index) => (
              <tr key={speaker.id}>
                <td>{index + 1}</td>
                <td>{speaker.fullname}</td>
                <td>{speaker.organization}</td>
                <td>{ROLE_CHOICES.find(role => role.value === speaker.role)?.label || speaker.role}</td>
                <td>{STATUS_CHOICES.find(status => status.value === speaker.status)?.label || speaker.status}</td>
                <td>{speaker.bio}</td>
                <td>{speaker.email}</td>
                <td>{speaker.phone_number}</td>
                <td>{speaker.expertise}</td>
                <td>
                  <Button variant="outline-info" onClick={() => handleViewSpeaker(speaker)}>
                    <FaUser /> View
                  </Button>
                  <Button variant="outline-primary" onClick={() => handleUpdateSpeaker(speaker)}>
                    <FaPen /> Edit
                  </Button>
                  <Button variant="outline-danger" onClick={() => handleDeleteSpeaker(speaker.id)}>
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
          <Modal.Title>Add Speaker</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFullname">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullname"
                value={newSpeaker.fullname}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formOrganization">
              <Form.Label>Organization</Form.Label>
              <Form.Control
                type="text"
                name="organization"
                value={newSpeaker.organization}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Control as="select" name="role" value={newSpeaker.role} onChange={handleChange}>
                <option value="">Select Role</option>
                {ROLE_CHOICES.map((role) => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control as="select" name="status" value={newSpeaker.status} onChange={handleChange}>
                <option value="">Select Status</option>
                {STATUS_CHOICES.map((status) => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formBio">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="bio"
                value={newSpeaker.bio}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newSpeaker.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formPhoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phone_number"
                value={newSpeaker.phone_number}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formImage">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleImageChange}
              />
            </Form.Group>
            <Form.Group controlId="formExpertise">
              <Form.Label>Expertise</Form.Label>
              <Form.Control
                type="text"
                name="expertise"
                value={newSpeaker.expertise}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddSpeaker}>
            Add Speaker
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Speaker</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFullname">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="fullname"
                value={newSpeaker.fullname}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formOrganization">
              <Form.Label>Organization</Form.Label>
              <Form.Control
                type="text"
                name="organization"
                value={newSpeaker.organization}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Control as="select" name="role" value={newSpeaker.role} onChange={handleChange}>
                <option value="">Select Role</option>
                {ROLE_CHOICES.map((role) => (
                  <option key={role.value} value={role.value}>{role.label}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control as="select" name="status" value={newSpeaker.status} onChange={handleChange}>
                <option value="">Select Status</option>
                {STATUS_CHOICES.map((status) => (
                  <option key={status.value} value={status.value}>{status.label}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formBio">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="bio"
                value={newSpeaker.bio}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newSpeaker.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formPhoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phone_number"
                value={newSpeaker.phone_number}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="formImage">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleImageChange}
              />
            </Form.Group>
            <Form.Group controlId="formExpertise">
              <Form.Label>Expertise</Form.Label>
              <Form.Control
                type="text"
                name="expertise"
                value={newSpeaker.expertise}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateSubmit}>
            Update Speaker
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>View Speaker</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSpeaker && (
            <div>
              <h4>{selectedSpeaker.fullname}</h4>
              <p><FaBriefcase /> {selectedSpeaker.organization}</p>
              {selectedSpeaker.image && (
                <img src={selectedSpeaker.image} alt="Speaker" style={{ width: '100%' }} />
              )}
              <p><strong>Role:</strong> {ROLE_CHOICES.find(role => role.value === selectedSpeaker.role)?.label}</p>
              <p><strong>Status:</strong> {STATUS_CHOICES.find(status => status.value === selectedSpeaker.status)?.label}</p>
              <p><strong>Bio:</strong> {selectedSpeaker.bio}</p>
              <p><FaEnvelope /> {selectedSpeaker.email}</p>
              <p><FaPhone /> {selectedSpeaker.phone_number}</p>
              <p><strong>Expertise:</strong> {selectedSpeaker.expertise}</p>
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

export default Speakers;
