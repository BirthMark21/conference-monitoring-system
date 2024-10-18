import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form, Alert, Table } from "react-bootstrap";
import { FaFileAlt, FaTrash, FaPlus, FaSave, FaEye } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
// import "./Abstracts.css"; // Import CSS file for additional styles

const Abstracts = () => {
  const [abstracts, setAbstracts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAbstract, setSelectedAbstract] = useState(null);
  const [newAbstract, setNewAbstract] = useState({
    author: "",
    title: "",
    content_text: "",
    reviewers: "",
    document: null,
    abstract_image: null,
    content_type: "text",
  });
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchAbstracts();
  }, []);

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

  const handleAddAbstract = async () => {
    try {
      const formData = new FormData();
      for (const key in newAbstract) {
        formData.append(key, newAbstract[key]);
      }

      const response = await fetch("http://127.0.0.1:8000/api/abstracts/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        fetchAbstracts();
        setShowAddModal(false);
        setSuccessMessage("Abstract added successfully!");
        setNewAbstract({
          author: "",
          title: "",
          content_text: "",
          reviewers: "",
          document: null,
          abstract_image: null,
          content_type: "text",
        });
      } else {
        console.error("Error adding abstract:", response.status);
      }
    } catch (error) {
      console.error("Error adding abstract:", error);
    }
  };

  const handleDeleteAbstract = async (abstractId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/abstracts/${abstractId}/`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchAbstracts();
        setSuccessMessage("Abstract deleted successfully!");
      } else {
        console.error("Error deleting abstract:", response.status);
      }
    } catch (error) {
      console.error("Error deleting abstract:", error);
    }
  };

  const handleViewDetails = (abstract) => {
    setSelectedAbstract(abstract);
    setShowDetailsModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewAbstract((prevAbstract) => ({
      ...prevAbstract,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setNewAbstract((prevAbstract) => ({
        ...prevAbstract,
        [name]: files[0],
      }));
    }
  };

  return (
    <div>
      <h1 className="main-heading">Submit Your Abstract</h1>
      <div className="text-center mb-4">
        <img src="src/img/abstracts.jpg" alt="Abstracts" style={{ maxWidth: "100%" }} />
      </div>
      <h2 className="sub-heading">Submitted Abstracts</h2>
      <div className="row">
        {abstracts.map((abstract) => (
          <div key={abstract.id} className="col-lg-4 col-md-6 mb-4">
            <Card className="abstract-card">
              <Card.Body>
                <Card.Title>{abstract.title}</Card.Title>
                <Card.Text><FaFileAlt /> Author: {abstract.author}</Card.Text>
                <Card.Text><FaFileAlt /> Status: {abstract.status}</Card.Text>
                <Button variant="primary" onClick={() => handleViewDetails(abstract)}><FaEye /> View Details</Button>
                <Button variant="danger" onClick={() => handleDeleteAbstract(abstract.id)}><FaTrash /> Delete</Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
      <Button onClick={() => setShowAddModal(true)} className="mb-3"><FaPlus /> Add Abstract</Button>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Abstract</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="author">
              <Form.Label>Author</Form.Label>
              <Form.Control type="text" name="author" value={newAbstract.author} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" name="title" value={newAbstract.title} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="content_text">
              <Form.Label>Content Text</Form.Label>
              <Form.Control as="textarea" name="content_text" value={newAbstract.content_text} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="reviewers">
              <Form.Label>Reviewers</Form.Label>
              <Form.Control type="text" name="reviewers" value={newAbstract.reviewers} onChange={handleChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="document">
              <Form.Label>Document</Form.Label>
              <Form.Control type="file" name="document" onChange={handleFileChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="abstract_image">
              <Form.Label>Abstract Image</Form.Label>
              <Form.Control type="file" name="abstract_image" onChange={handleFileChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="content_type">
              <Form.Label>Content Type</Form.Label>
              <Form.Control as="select" name="content_type" value={newAbstract.content_type} onChange={handleChange}>
                <option value="pdf">PDF</option>
                <option value="doc">DOC</option>
                <option value="jpeg">JPEG</option>
                <option value="png">PNG</option>
                <option value="mp4">MP4</option>
                <option value="text">Text</option>
              </Form.Control>
            </Form.Group>
          </Form>
          {successMessage && <Alert variant="success">{successMessage}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddAbstract}><FaSave /> Add</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Abstract Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAbstract && (
            <div>
              <p><strong>Author:</strong> {selectedAbstract.author}</p>
              <p><strong>Title:</strong> {selectedAbstract.title}</p>
              <p><strong>Content Text:</strong> {selectedAbstract.content_text}</p>
              <p><strong>Reviewers:</strong> {selectedAbstract.reviewers}</p>
              <p><strong>Status:</strong> {selectedAbstract.status}</p>
              {selectedAbstract.document && (
                <p><strong>Document:</strong> <a href={selectedAbstract.document} target="_blank" rel="noopener noreferrer">View Document</a></p>
              )}
              {selectedAbstract.abstract_image && (
                <p><strong>Abstract Image:</strong> <img src={selectedAbstract.abstract_image} alt={selectedAbstract.title} style={{ maxWidth: '100%' }} /></p>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Abstracts;
