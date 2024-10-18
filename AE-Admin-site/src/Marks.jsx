import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Button, Modal, Form, Dropdown, Table, Row, Col, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import { FaEye, FaPen, FaTrash, FaSave, FaTh, FaList } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./PaperEase.css";
import HeaderAdmin from "./HeaderBak";
import { Search, FilePenLine } from 'lucide-react';

const links = [
  { name: 'Product Show', icon: Search, link: '/showcase' },
  { name: 'Assign Reviewer', icon: Search, link: '/assign' },
  { name: 'Paper Submission', icon: Search, link: '/paper' },
  { name: 'Give Mark', icon: FilePenLine, link: '/marks' },
  { name: 'Packages', icon: FilePenLine, link: '/packages' },
  { name: 'Contents', icon: FilePenLine, link: '/contents' },
  { name: 'Reviewer Report', icon: Search, link: '/reviewerreport' },
];

const Marks = () => {
  const [abstracts, setAbstracts] = useState([]);
  const [reviewers, setReviewers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    reviewer: "",
    abstract: "",
    comments: "",
    rating: 0,
    reviewed_at: "",
    deadline: "",
    feedback: "",
    clarity_and_coherence: 0,
    relevance: 0,
    originality_and_innovation: 0,
    methodology: 0,
    significance: 0,
    conclusions: 0,
    accuracy_and_validity: 0,
    conciseness: 0,
    language_and_style: 0,
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [view, setView] = useState("table");

  useEffect(() => {
    fetchReviewers();
    fetchAbstracts();
    fetchReviews();
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

  const fetchAbstracts = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/abstracts/");
      if (response.ok) {
        const data = await response.json();
        setAbstracts(data);
      } else {
        console.error("Error fetching abstracts:", response.status);
      }
    } catch (error) {
      console.error("Error fetching abstracts:", error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/reviews/");
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      } else {
        console.error("Error fetching reviews:", response.status);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleAddReview = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/reviews/", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });
      if (response.ok) {
        fetchReviews();
        setShowAddModal(false);
        setNewReview({
          reviewer: "",
          abstract: "",
          comments: "",
          rating: 0,
          reviewed_at: "",
          deadline: "",
          feedback: "",
          clarity_and_coherence: 0,
          relevance: 0,
          originality_and_innovation: 0,
          methodology: 0,
          significance: 0,
          conclusions: 0,
          accuracy_and_validity: 0,
          conciseness: 0,
          language_and_style: 0,
        });
      } else {
        console.error("Error adding review:", response.status);
      }
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const handleUpdateReview = (review) => {
    setSelectedReview(review);
    setNewReview(review);
    setShowUpdateModal(true);
  };

  const handleUpdateSubmit = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/reviews/${selectedReview.id}/`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview),
      });
      if (response.ok) {
        fetchReviews();
        setShowUpdateModal(false);
      } else {
        console.error("Error updating review:", response.status);
      }
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const handleDeleteReview = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/reviews/${id}/`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchReviews();
      } else {
        console.error("Error deleting review:", response.status);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleViewDetails = (review) => {
    setSelectedReview(review);
    setShowDetailsModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewReview({ ...newReview, [name]: value });
  };

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
          <Col>
            <Button onClick={() => setShowAddModal(true)}>Add Review</Button>
          </Col>
          <Col>
            <ToggleButtonGroup type="radio" name="view" value={view} onChange={(val) => setView(val)}>
              <ToggleButton id="tbg-radio-1" value="table">
                <FaList /> Table View
              </ToggleButton>
              <ToggleButton id="tbg-radio-2" value="card">
                <FaTh /> Card View
              </ToggleButton>
            </ToggleButtonGroup>
          </Col>
        </Row>

        {view === "table" ? (
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Abstract Title</th>
                  <th>Reviewer Name</th>
                  <th>Comments</th>
                  <th>Rating</th>
                  <th>Reviewed At</th>
                  <th>Deadline</th>
                  <th>Feedback</th>
                  <th>Clarity & Coherence</th>
                  <th>Relevance</th>
                  <th>Originality & Innovation</th>
                  <th>Methodology</th>
                  <th>Significance</th>
                  <th>Conclusions</th>
                  <th>Accuracy & Validity</th>
                  <th>Conciseness</th>
                  <th>Language & Style</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review, index) => (
                  <tr key={review.id}>
                    <td>{index + 1}</td>
                    <td>{review.abstract_title}</td>
                    <td>{review.reviewer_name}</td>
                    <td>{review.comments}</td>
                    <td>{review.rating}</td>
                    <td>{review.reviewed_at}</td>
                    <td>{review.deadline}</td>
                    <td>{review.feedback}</td>
                    <td>{review.clarity_and_coherence}</td>
                    <td>{review.relevance}</td>
                    <td>{review.originality_and_innovation}</td>
                    <td>{review.methodology}</td>
                    <td>{review.significance}</td>
                    <td>{review.conclusions}</td>
                    <td>{review.accuracy_and_validity}</td>
                    <td>{review.conciseness}</td>
                    <td>{review.language_and_style}</td>
                    <td>
                      <Button variant="primary" onClick={() => handleViewDetails(review)}><FaEye /></Button>
                      <Button variant="warning" onClick={() => handleUpdateReview(review)}><FaPen /></Button>
                      <Button variant="danger" onClick={() => handleDeleteReview(review.id)}><FaTrash /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <Row>
            {reviews.map((review) => (
              <Col md={4} key={review.id} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>{review.abstract_title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Reviewed by {review.reviewer_name}</Card.Subtitle>
                    <Card.Text>
                      <strong>Comments:</strong> {review.comments}<br />
                      <strong>Rating:</strong> {review.rating}<br />
                      <strong>Reviewed At:</strong> {review.reviewed_at}<br />
                      <strong>Deadline:</strong> {review.deadline}<br />
                      <strong>Feedback:</strong> {review.feedback}<br />
                      <strong>Clarity & Coherence:</strong> {review.clarity_and_coherence}<br />
                      <strong>Relevance:</strong> {review.relevance}<br />
                      <strong>Originality & Innovation:</strong> {review.originality_and_innovation}<br />
                      <strong>Methodology:</strong> {review.methodology}<br />
                      <strong>Significance:</strong> {review.significance}<br />
                      <strong>Conclusions:</strong> {review.conclusions}<br />
                      <strong>Accuracy & Validity:</strong> {review.accuracy_and_validity}<br />
                      <strong>Conciseness:</strong> {review.conciseness}<br />
                      <strong>Language & Style:</strong> {review.language_and_style}
                    </Card.Text>
                    <Button variant="primary" onClick={() => handleViewDetails(review)}><FaEye /></Button>
                    <Button variant="warning" onClick={() => handleUpdateReview(review)}><FaPen /></Button>
                    <Button variant="danger" onClick={() => handleDeleteReview(review.id)}><FaTrash /></Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Abstract</Form.Label>
              <Form.Control as="select" name="abstract" value={newReview.abstract} onChange={handleChange}>
                <option value="">Select Abstract</option>
                {abstracts.map((abstract) => (
                  <option key={abstract.id} value={abstract.id}>{abstract.title}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Reviewer</Form.Label>
              <Form.Control as="select" name="reviewer" value={newReview.reviewer} onChange={handleChange}>
                <option value="">Select Reviewer</option>
                {reviewers.map((reviewer) => (
                  <option key={reviewer.id} value={reviewer.id}>{reviewer.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Comments</Form.Label>
              <Form.Control type="text" name="comments" value={newReview.comments} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Rating</Form.Label>
              <Form.Control type="number" name="rating" value={newReview.rating} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Reviewed At</Form.Label>
              <Form.Control type="date" name="reviewed_at" value={newReview.reviewed_at} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Deadline</Form.Label>
              <Form.Control type="date" name="deadline" value={newReview.deadline} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Feedback</Form.Label>
              <Form.Control type="text" name="feedback" value={newReview.feedback} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Clarity & Coherence</Form.Label>
              <Form.Control type="number" name="clarity_and_coherence" value={newReview.clarity_and_coherence} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Relevance</Form.Label>
              <Form.Control type="number" name="relevance" value={newReview.relevance} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Originality & Innovation</Form.Label>
              <Form.Control type="number" name="originality_and_innovation" value={newReview.originality_and_innovation} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Methodology</Form.Label>
              <Form.Control type="number" name="methodology" value={newReview.methodology} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Significance</Form.Label>
              <Form.Control type="number" name="significance" value={newReview.significance} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Conclusions</Form.Label>
              <Form.Control type="number" name="conclusions" value={newReview.conclusions} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Accuracy & Validity</Form.Label>
              <Form.Control type="number" name="accuracy_and_validity" value={newReview.accuracy_and_validity} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Conciseness</Form.Label>
              <Form.Control type="number" name="conciseness" value={newReview.conciseness} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Language & Style</Form.Label>
              <Form.Control type="number" name="language_and_style" value={newReview.language_and_style} onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddReview}>Save Review</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Abstract</Form.Label>
              <Form.Control as="select" name="abstract" value={newReview.abstract} onChange={handleChange}>
                <option value="">Select Abstract</option>
                {abstracts.map((abstract) => (
                  <option key={abstract.id} value={abstract.id}>{abstract.title}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Reviewer</Form.Label>
              <Form.Control as="select" name="reviewer" value={newReview.reviewer} onChange={handleChange}>
                <option value="">Select Reviewer</option>
                {reviewers.map((reviewer) => (
                  <option key={reviewer.id} value={reviewer.id}>{reviewer.name}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Comments</Form.Label>
              <Form.Control type="text" name="comments" value={newReview.comments} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Rating</Form.Label>
              <Form.Control type="number" name="rating" value={newReview.rating} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Reviewed At</Form.Label>
              <Form.Control type="date" name="reviewed_at" value={newReview.reviewed_at} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Deadline</Form.Label>
              <Form.Control type="date" name="deadline" value={newReview.deadline} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Feedback</Form.Label>
              <Form.Control type="text" name="feedback" value={newReview.feedback} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Clarity & Coherence</Form.Label>
              <Form.Control type="number" name="clarity_and_coherence" value={newReview.clarity_and_coherence} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Relevance</Form.Label>
              <Form.Control type="number" name="relevance" value={newReview.relevance} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Originality & Innovation</Form.Label>
              <Form.Control type="number" name="originality_and_innovation" value={newReview.originality_and_innovation} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Methodology</Form.Label>
              <Form.Control type="number" name="methodology" value={newReview.methodology} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Significance</Form.Label>
              <Form.Control type="number" name="significance" value={newReview.significance} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Conclusions</Form.Label>
              <Form.Control type="number" name="conclusions" value={newReview.conclusions} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Accuracy & Validity</Form.Label>
              <Form.Control type="number" name="accuracy_and_validity" value={newReview.accuracy_and_validity} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Conciseness</Form.Label>
              <Form.Control type="number" name="conciseness" value={newReview.conciseness} onChange={handleChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Language & Style</Form.Label>
              <Form.Control type="number" name="language_and_style" value={newReview.language_and_style} onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleUpdateSubmit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Review Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReview && (
            <div>
              <p><strong>Abstract Title:</strong> {selectedReview.abstract_title}</p>
              <p><strong>Reviewer Name:</strong> {selectedReview.reviewer_name}</p>
              <p><strong>Comments:</strong> {selectedReview.comments}</p>
              <p><strong>Rating:</strong> {selectedReview.rating}</p>
              <p><strong>Reviewed At:</strong> {selectedReview.reviewed_at}</p>
              <p><strong>Deadline:</strong> {selectedReview.deadline}</p>
              <p><strong>Feedback:</strong> {selectedReview.feedback}</p>
              <p><strong>Clarity & Coherence:</strong> {selectedReview.clarity_and_coherence}</p>
              <p><strong>Relevance:</strong> {selectedReview.relevance}</p>
              <p><strong>Originality & Innovation:</strong> {selectedReview.originality_and_innovation}</p>
              <p><strong>Methodology:</strong> {selectedReview.methodology}</p>
              <p><strong>Significance:</strong> {selectedReview.significance}</p>
              <p><strong>Conclusions:</strong> {selectedReview.conclusions}</p>
              <p><strong>Accuracy & Validity:</strong> {selectedReview.accuracy_and_validity}</p>
              <p><strong>Conciseness:</strong> {selectedReview.conciseness}</p>
              <p><strong>Language & Style:</strong> {selectedReview.language_and_style}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Marks;
