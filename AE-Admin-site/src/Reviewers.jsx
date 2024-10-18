import React, { useState, useEffect } from "react";
import { Table, Card, Button, Modal, Form, Alert, ButtonGroup } from "react-bootstrap";
import { FaSave, FaPen, FaTrash, FaThList, FaThLarge, FaEnvelope, FaPhone, FaStar, FaUser, FaImage, FaEye, FaSuitcase, FaChartLine } from "react-icons/fa";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const Reviewers = () => {
  const [reviewers, setReviewers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedReviewer, setSelectedReviewer] = useState(null);
  const [newReviewer, setNewReviewer] = useState({
    name: "",
    email: "",
    phone_number: "",
    expertise: "",
    rating: 0,
    status: "free",
    total_reviews_completed: 0,
    banner: null,
    affiliation: "",
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [viewMode, setViewMode] = useState("card");

  useEffect(() => {
    fetchReviewers();
  }, []);

  const fetchReviewers = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/reviewers/");
      setReviewers(response.data);
    } catch (error) {
      console.error("Error fetching reviewers:", error);
    }
  };

  const handleAddReviewer = async () => {
    try {
      const formData = new FormData();
      for (const key in newReviewer) {
        formData.append(key, newReviewer[key]);
      }

      await axios.post("http://127.0.0.1:8000/api/reviewers/", formData);
      fetchReviewers();
      setShowAddModal(false);
      showAlert("Reviewer added successfully!", "success");
    } catch (error) {
      console.error("Error adding reviewer:", error);
      showAlert("Error adding reviewer", "danger");
    }
  };

  const handleDeleteReviewer = async (reviewerId) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/reviewers/${reviewerId}/`);
      fetchReviewers();
      showAlert("Reviewer deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting reviewer:", error);
      showAlert("Error deleting reviewer", "danger");
    }
  };

  const handleUpdateReviewer = (reviewer) => {
    setSelectedReviewer(reviewer);
    setNewReviewer({
      ...reviewer,
      name: reviewer.name || "",
      email: reviewer.email || "",
      phone_number: reviewer.phone_number || "",
      expertise: reviewer.expertise || "",
      rating: reviewer.rating || 0,
      status: reviewer.status || "free",
      total_reviews_completed: reviewer.total_reviews_completed || 0,
      banner: reviewer.banner || null,
      affiliation: reviewer.affiliation || "",
    });
    setShowUpdateModal(true);
  };

  const handleViewReviewer = (reviewer) => {
    setSelectedReviewer(reviewer);
    setShowViewModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewReviewer((prevReviewer) => ({
      ...prevReviewer,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewReviewer((prevReviewer) => ({
        ...prevReviewer,
        banner: file,
      }));
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      const formData = new FormData();
      for (const key in newReviewer) {
        formData.append(key, newReviewer[key]);
      }

      await axios.put(`http://127.0.0.1:8000/api/reviewers/${newReviewer.id}/`, formData);
      fetchReviewers();
      setShowUpdateModal(false);
      showAlert("Reviewer updated successfully!", "success");
    } catch (error) {
      console.error("Error updating reviewer:", error);
      showAlert("Error updating reviewer", "danger");
    }
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
        <FaSave /> Add Reviewer
      </Button>

      {viewMode === "card" ? (
        <div className="d-flex flex-wrap">
          {reviewers.map((reviewer) => (
            <Card key={reviewer.id} className="mb-3 me-3" style={{ width: "18rem" }}>
              
              <Card.Body>
                <Card.Title> <FaUser /> {reviewer.name}</Card.Title>
                {reviewer.banner && <Card.Img variant="top" src={reviewer.banner} alt="Reviewer Banner" />}
                <Card.Text><FaSuitcase /> {reviewer.expertise}</Card.Text>
                
                <div className="d-flex justify-content-between">
                  <Button variant="outline-info" onClick={() => handleViewReviewer(reviewer)}>
                    <FaEye /> View
                  </Button>
                  <Button variant="outline-primary" onClick={() => handleUpdateReviewer(reviewer)}>
                    <FaPen /> Edit
                  </Button>
                  <Button variant="outline-danger" onClick={() => handleDeleteReviewer(reviewer.id)}>
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
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Expertise</th>
              <th>Rating</th>
              <th>Reviews Completed</th>
              <th>Status</th>
              <th>Banner</th>
              <th>Affiliation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviewers.map((reviewer, index) => (
              <tr key={reviewer.id}>
                <td>{index + 1}</td>
                <td>{reviewer.name}</td>
                <td>{reviewer.email}</td>
                <td>{reviewer.phone_number}</td>
                <td>{reviewer.expertise}</td>
                <td>{reviewer.rating}</td>
                <td>{reviewer.total_reviews_completed}</td>
                <td>{reviewer.status}</td>
                <td>
                  {reviewer.banner && <img src={reviewer.banner} alt="Reviewer Banner" style={{ width: "50px" }} />}
                </td>
                <td>{reviewer.affiliation}</td>
                <td>
                  <Button variant="outline-info" onClick={() => handleViewReviewer(reviewer)} className="me-2">
                    <FaEye /> View
                  </Button>
                  <Button variant="outline-primary" onClick={() => handleUpdateReviewer(reviewer)} className="me-2">
                    <FaPen /> Edit
                  </Button>
                  <Button variant="outline-danger" onClick={() => handleDeleteReviewer(reviewer.id)}>
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
          <Modal.Title>Add Reviewer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newReviewer.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newReviewer.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="phone_number">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phone_number"
                value={newReviewer.phone_number}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="expertise">
              <Form.Label>Expertise</Form.Label>
              <Form.Control
                type="text"
                name="expertise"
                value={newReviewer.expertise}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="rating">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                name="rating"
                value={newReviewer.rating}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={newReviewer.status}
                onChange={handleChange}
              >
                <option value="free">Free</option>
                <option value="busy">Busy</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="total_reviews_completed">
              <Form.Label>Total Reviews Completed</Form.Label>
              <Form.Control
                type="number"
                name="total_reviews_completed"
                value={newReviewer.total_reviews_completed}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="banner">
              <Form.Label>Banner</Form.Label>
              <Form.Control
                type="file"
                name="banner"
                onChange={handleImageChange}
              />
            </Form.Group>
            <Form.Group controlId="affiliation">
              <Form.Label>Affiliation</Form.Label>
              <Form.Control
                type="text"
                name="affiliation"
                value={newReviewer.affiliation}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddReviewer}>
            Register Reviewers 
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Reviewer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newReviewer.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newReviewer.email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="phone_number">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phone_number"
                value={newReviewer.phone_number}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="expertise">
              <Form.Label>Expertise</Form.Label>
              <Form.Control
                type="text"
                name="expertise"
                value={newReviewer.expertise}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="rating">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                name="rating"
                value={newReviewer.rating}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="status">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                name="status"
                value={newReviewer.status}
                onChange={handleChange}
              >
                <option value="free">Free</option>
                <option value="busy">Busy</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="total_reviews_completed">
              <Form.Label>Total Reviews Completed</Form.Label>
              <Form.Control
                type="number"
                name="total_reviews_completed"
                value={newReviewer.total_reviews_completed}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="banner">
              <Form.Label>Banner</Form.Label>
              <Form.Control
                type="file"
                name="banner"
                onChange={handleImageChange}
              />
            </Form.Group>
            <Form.Group controlId="affiliation">
              <Form.Label>Affiliation</Form.Label>
              <Form.Control
                type="text"
                name="affiliation"
                value={newReviewer.affiliation}
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
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>View Reviewer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReviewer && (
            <div>
              <p><strong>Name:</strong> {selectedReviewer.name}</p>
              <p><strong>Email:</strong> {selectedReviewer.email}</p>
              <p><strong>Phone Number:</strong> {selectedReviewer.phone_number}</p>
              <p><strong>Expertise:</strong> {selectedReviewer.expertise}</p>
              <p><strong>Rating:</strong> {selectedReviewer.rating}</p>
              <p><strong>Status:</strong> {selectedReviewer.status}</p>
              <p><strong>Total Reviews Completed:</strong> {selectedReviewer.total_reviews_completed}</p>
              <p><strong>Affiliation:</strong> {selectedReviewer.affiliation}</p>
              {selectedReviewer.banner && <img src={selectedReviewer.banner} alt="Reviewer Banner" />}
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

export default Reviewers;
