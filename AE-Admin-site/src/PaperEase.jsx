import React, { useState, useEffect, useContext } from "react";
import { useLocation, Link } from "react-router-dom";
import { Card, Button, Modal, Form, Dropdown, Table, Row, Col, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import { FaEye, FaPen, FaTrash, FaSave, FaTh, FaList } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./PaperEase.css";
import { EventContext } from "./MyContext";
import HeaderAdmin from "./HeaderBak";
import imageUrl from "./img/event.jpg";
import { Search, FilePenLine } from 'lucide-react';

//PaperResult
const links = [
 
  { name: 'Assign Reviewer', icon: Search, link: '/assign' },
  { name: 'Paper Submission', icon: Search, link: '/paper' },
  { name: 'Register Reviewer', icon: Search, link: '/reviewers' },
  { name: 'Give Mark ', icon: FilePenLine, link: '/marks' },
  { name: 'Packages', icon: FilePenLine, link: '/packages' },
  // { name: 'Creat Agenda', icon: FilePenLine, link: '/agendamanager' },
  { name: 'ReviewerReport', icon: Search, link: '/reviewerreport' },
];

const PaperEase = () => {
  const [reviewers, setReviewers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedReviewer, setSelectedReviewer] = useState(null);
  const [newReviewer, setNewReviewer] = useState({
    name: "",
    expertise: "",
    rating: 0,
    status: "free",
    total_reviews_completed: 0,
    affiliation: "",
    email: "",
    banner: null,
  });
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [view, setView] = useState("table");

  useEffect(() => {
    fetchReviewers();
  }, []);

  const fetchReviewers = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/reviewers/");
      if (response.ok) {
        const data = await response.json();
        setReviewers(data);
      } else {
        console.error("Error fetching reviewers:", response.status);
      }
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
      const response = await fetch("http://127.0.0.1:8000/api/reviewers/", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        fetchReviewers();
        setShowAddModal(false);
      } else {
        console.error("Error adding reviewer:", response.status);
      }
    } catch (error) {
      console.error("Error adding reviewer:", error);
    }
  };

  const handleUpdateReviewer = (reviewer) => {
    setSelectedReviewer(reviewer);
    setNewReviewer(reviewer);
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      const formData = new FormData();
      for (const key in newReviewer) {
        formData.append(key, newReviewer[key]);
      }
      const response = await fetch(`http://127.0.0.1:8000/api/reviewers/${selectedReviewer.id}/`, {
        method: "PUT",
        body: formData,
      });
      if (response.ok) {
        fetchReviewers();
        setShowUpdateModal(false);
      } else {
        console.error("Error updating reviewer:", response.status);
      }
    } catch (error) {
      console.error("Error updating reviewer:", error);
    }
  };

  const handleDeleteReviewer = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/reviewers/${id}/`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchReviewers();
      } else {
        console.error("Error deleting reviewer:", response.status);
      }
    } catch (error) {
      console.error("Error deleting reviewer:", error);
    }
  };

  const handleViewDetails = (reviewer) => {
    setSelectedReviewer(reviewer);
    setShowDetailsModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewReviewer({ ...newReviewer, [name]: value });
  };

  const handleImageChange = (e) => {
    setNewReviewer({ ...newReviewer, banner: e.target.files[0] });
  };

  const filteredReviewers = reviewers.filter((reviewer) => {
    return (
      (selectedStatus === "" || reviewer.status === selectedStatus) &&
      (selectedRating === "" || reviewer.rating.toString() === selectedRating)
    );
  });

  return (
    <div>
      <HeaderAdmin />
      <div className="navbar-links">
        {links.map(({ name, icon: Icon, link }) => (
          <Link key={name} to={link} className="nav-link">
            <Icon className="link-icon" />
            {name}
          </Link>
        ))}
      </div>

      <div className="container mt-4">
        <Row className="mb-4">
          {/* <Col> */}
            {/* <Button onClick={() => setShowAddModal(true)}>Add Reviewer</Button> */}
          {/* </Col>
          <Col>
            <Form.Control
              as="select"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Filter by Status</option>
              <option value="free">Free</option>
              <option value="busy">Busy</option>
            </Form.Control>
          </Col> */}
          {/* <Col>
            <Form.Control
              as="select"
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
            >
              <option value="">Filter by Rating</option>
              {[1, 2, 3, 4, 5].map((rating) => (
                <option key={rating} value={rating}>
                  {rating}
                </option>
              ))}
            </Form.Control>
          </Col> */}
          {/* <Col>
            <ToggleButtonGroup type="radio" name="view" value={view} onChange={(val) => setView(val)}>
              <ToggleButton id="tbg-radio-1" value="table">
                <FaList /> Table View
              </ToggleButton>
              <ToggleButton id="tbg-radio-2" value="card">
                <FaTh /> Card View
              </ToggleButton>
            </ToggleButtonGroup>
          </Col> */}
        </Row>

        {view === "table" ? (
          <Table striped bordered hover>
            {/* <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Expertise</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Total Reviews</th>
                <th>Affiliation</th>
                <th>Email</th>
                <th>Banner</th>
                <th>Actions</th>
              </tr>
            </thead> */}
            {/* <tbody>
              {filteredReviewers.map((reviewer, index) => (
                <tr key={reviewer.id}>
                  <td>{index + 1}</td>
                  <td>{reviewer.name}</td>
                  <td>{reviewer.expertise}</td>
                  <td>{reviewer.rating}</td>
                  <td>{reviewer.status}</td>
                  <td>{reviewer.total_reviews_completed}</td>
                  <td>{reviewer.affiliation}</td>
                  <td>{reviewer.email}</td>
                  <td>
                    {reviewer.banner && (
                      <img src={`http://127.0.0.1:8000${reviewer.banner}`} alt="Banner" className="banner-image" />
                    )}
                  </td>
                  <td>
                    <Button variant="info" onClick={() => handleViewDetails(reviewer)}>
                      <FaEye />
                    </Button>
                    <Button variant="warning" onClick={() => handleUpdateReviewer(reviewer)}>
                      <FaPen />
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteReviewer(reviewer.id)}>
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody> */}
          </Table>
        ) : (
          <Row>
            {filteredReviewers.map((reviewer) => (
              <Col md={4} key={reviewer.id}>
                <Card className="mb-4">
                  <Card.Img variant="top" src={`http://127.0.0.1:8000${reviewer.banner}`} />
                  <Card.Body>
                    <Card.Title>{reviewer.name}</Card.Title>
                    <Card.Text>
                      <strong>Expertise:</strong> {reviewer.expertise}<br />
                      <strong>Rating:</strong> {reviewer.rating}<br />
                      <strong>Status:</strong> {reviewer.status}<br />
                      <strong>Total Reviews Completed:</strong> {reviewer.total_reviews_completed}<br />
                      <strong>Affiliation:</strong> {reviewer.affiliation}<br />
                      <strong>Email:</strong> {reviewer.email}<br />
                    </Card.Text>
                    <Button variant="info" onClick={() => handleViewDetails(reviewer)} className="mr-2">
                      <FaEye /> View
                    </Button>
                    <Button variant="warning" onClick={() => handleUpdateReviewer(reviewer)} className="mr-2">
                      <FaPen /> Edit
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteReviewer(reviewer.id)}>
                      <FaTrash /> Delete
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          {/* <Modal.Title>Add Reviewer</Modal.Title> */}
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newReviewer.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formExpertise">
              <Form.Label>Expertise</Form.Label>
              <Form.Control
                type="text"
                name="expertise"
                value={newReviewer.expertise}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formRating">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="number"
                name="rating"
                value={newReviewer.rating}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                type="text"
                name="status"
                value={newReviewer.status}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formTotalReviews">
              <Form.Label>Total Reviews Completed</Form.Label>
              <Form.Control
                type="number"
                name="total_reviews_completed"
                value={newReviewer.total_reviews_completed}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formAffiliation">
              <Form.Label>Affiliation</Form.Label>
              <Form.Control
                type="text"
                name="affiliation"
                value={newReviewer.affiliation}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newReviewer.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formBanner">
              <Form.Label>Banner</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddReviewer}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reviewer Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReviewer && (
            <div>
              <p><strong>Name:</strong> {selectedReviewer.name}</p>
              <p><strong>Expertise:</strong> {selectedReviewer.expertise}</p>
              <p><strong>Rating:</strong> {selectedReviewer.rating}</p>
              <p><strong>Status:</strong> {selectedReviewer.status}</p>
              <p><strong>Total Reviews Completed:</strong> {selectedReviewer.total_reviews_completed}</p>
              <p><strong>Affiliation:</strong> {selectedReviewer.affiliation}</p>
              <p><strong>Email:</strong> {selectedReviewer.email}</p>
              {selectedReviewer.banner && (
                <img src={`http://127.0.0.1:8000${selectedReviewer.banner}`} alt="Banner" className="banner-image" />
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Reviewer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newReviewer.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formExpertise">
              <Form.Label>Expertise</Form.Label>
              <Form.Control
                type="text"
                name="expertise"
                value={newReviewer.expertise}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formRating">
              <Form.Label>Rating</Form.Label>
              <Form.Control
                type="number"
                name="rating"
                value={newReviewer.rating}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                type="text"
                name="status"
                value={newReviewer.status}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formTotalReviews">
              <Form.Label>Total Reviews Completed</Form.Label>
              <Form.Control
                type="number"
                name="total_reviews_completed"
                value={newReviewer.total_reviews_completed}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formAffiliation">
              <Form.Label>Affiliation</Form.Label>
              <Form.Control
                type="text"
                name="affiliation"
                value={newReviewer.affiliation}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={newReviewer.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formBanner">
              <Form.Label>Banner</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} />
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
    </div>
  );
};






export default PaperEase;



