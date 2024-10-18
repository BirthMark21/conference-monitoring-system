import React, { useEffect, useState } from 'react';
import { Button, Modal, Form, Table, Card } from 'react-bootstrap';
import { FaEdit, FaTrash, FaSave, FaEye } from 'react-icons/fa';
// import './Reviews.css';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    comments: "",
    rating: 0,
    feedback: "",
    clarity_and_coherence: 0,
    relevance: 0,
    originality_and_innovation: 0,
    methodology: 0,
    results: 0,
    significance: 0,
    conclusions: 0,
    accuracy_and_validity: 0,
    conciseness: 0,
    language_and_style: 0,
    review_type: "abstract",
    deadline: ""
  });
  const [selectedReview, setSelectedReview] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/reviews/");
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleAddReview = async () => {
    if (!validateForm()) return;

    try {
      const response = await fetch("http://127.0.0.1:8000/api/reviews/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });
      if (response.ok) {
        fetchReviews();
        setShowAddModal(false);
        resetNewReview();
      }
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const handleUpdateReview = async (id) => {
    if (!validateForm()) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/reviews/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newReview),
      });
      if (response.ok) {
        fetchReviews();
        setShowUpdateModal(false);
        resetNewReview();
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
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNewReview((prevReview) => ({
      ...prevReview,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const {
      comments,
      rating,
      feedback,
      clarity_and_coherence,
      relevance,
      originality_and_innovation,
      methodology,
      results,
      significance,
      conclusions,
      accuracy_and_validity,
      conciseness,
      language_and_style,
      review_type,
      deadline
    } = newReview;

    if (!comments || !rating || !feedback || !review_type || !deadline) {
      alert("Please fill in all required fields.");
      return false;
    }

    if (
      rating < 0 || clarity_and_coherence < 0 || relevance < 0 || originality_and_innovation < 0 ||
      methodology < 0 || results < 0 || significance < 0 || conclusions < 0 ||
      accuracy_and_validity < 0 || conciseness < 0 || language_and_style < 0
    ) {
      alert("Ratings must be non-negative values.");
      return false;
    }

    return true;
  };

  const resetNewReview = () => {
    setNewReview({
      comments: "",
      rating: 0,
      feedback: "",
      clarity_and_coherence: 0,
      relevance: 0,
      originality_and_innovation: 0,
      methodology: 0,
      results: 0,
      significance: 0,
      conclusions: 0,
      accuracy_and_validity: 0,
      conciseness: 0,
      language_and_style: 0,
      review_type: "abstract",
      deadline: ""
    });
  };

  return (
    <div>
      <h1 className="main-heading"> Evaluate the work of researchers!</h1>
      <img src="src/img/r44.jpg" alt="Speakers" style={{ maxWidth: "100%" }} />

      <Button variant="primary" onClick={() => setShowAddModal(true)}>
        Add Review
      </Button>
      <Table striped bordered hover className="review-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Comments</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review, index) => (
            <tr key={review.id}>
              <td>{index + 1}</td>
              <td>{review.comments}</td>
              <td>{review.rating}</td>
              <td>
                <Button
                  variant="info"
                  onClick={() => {
                    setSelectedReview(review);
                    setShowDetailsModal(true);
                  }}
                >
                  <FaEye /> Details
                </Button>
                <Button
                  variant="warning"
                  onClick={() => {
                    setSelectedReview(review);
                    setNewReview(review);
                    setShowUpdateModal(true);
                  }}
                >
                  <FaEdit /> Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleDeleteReview(review.id)}
                >
                  <FaTrash /> Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Review Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {Object.keys(newReview).map((key) => (
              <Form.Group className="mb-3" controlId={key} key={key}>
                <Form.Label>{key.replace(/_/g, ' ')}</Form.Label>
                <Form.Control
                  type={key === "rating" || key.includes("and") ? "number" : key === "deadline" ? "date" : "textarea"}
                  name={key}
                  value={newReview[key]}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            ))}
            <Button variant="primary" onClick={handleAddReview}>
              <FaSave /> Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Update Review Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {Object.keys(newReview).map((key) => (
              <Form.Group className="mb-3" controlId={key} key={key}>
                <Form.Label>{key.replace(/_/g, ' ')}</Form.Label>
                <Form.Control
                  type={key === "rating" || key.includes("and") ? "number" : key === "deadline" ? "date" : "textarea"}
                  name={key}
                  value={newReview[key]}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            ))}
            <Button variant="primary" onClick={() => handleUpdateReview(selectedReview.id)}>
              <FaSave /> Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Review Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Review Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReview && (
            <Card className="review-card">
              <Card.Body>
                {Object.keys(selectedReview).map((key) => (
                  <p key={key}><strong>{key.replace(/_/g, ' ')}:</strong> {selectedReview[key]}</p>
                ))}
              </Card.Body>
            </Card>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Reviews;
