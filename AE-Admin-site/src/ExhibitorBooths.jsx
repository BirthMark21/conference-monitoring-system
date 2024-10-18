import React, { useState, useEffect } from "react";
import { Table, Card, Button, Modal, Form, Alert, ButtonGroup } from "react-bootstrap";
import { FaSave, FaPen, FaTrash, FaThList, FaThLarge, FaImage, FaEye, FaMapMarkerAlt, FaUserTie } from "react-icons/fa";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const ExhibitorBooths = () => {
  const [booths, setBooths] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [newBooth, setNewBooth] = useState({
    name: "",
    booth_number: "",
    is_occupied: false,
    staff_count: 1,
    amenities: "",
    image: null,
    location: "",
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [viewMode, setViewMode] = useState("card");

  useEffect(() => {
    fetchBooths();
  }, []);

  const fetchBooths = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/exhibitor-booths/");
      setBooths(response.data);
    } catch (error) {
      console.error("Error fetching booths:", error);
    }
  };

  const handleAddBooth = async () => {
    try {
      const formData = new FormData();
      for (const key in newBooth) {
        formData.append(key, newBooth[key]);
      }

      await axios.post("http://localhost:8000/api/exhibitor-booths/", formData);
      fetchBooths();
      setShowAddModal(false);
      showAlert("Booth added successfully!", "success");
    } catch (error) {
      console.error("Error adding booth:", error);
      showAlert("Error adding booth", "danger");
    }
  };

  const handleDeleteBooth = async (boothId) => {
    try {
      await axios.delete(`http://localhost:8000/api/exhibitor-booths/${boothId}/`);
      fetchBooths();
      showAlert("Booth deleted successfully!", "success");
    } catch (error) {
      console.error("Error deleting booth:", error);
      showAlert("Error deleting booth", "danger");
    }
  };

  const handleUpdateBooth = (booth) => {
    setSelectedBooth(booth);
    setNewBooth({
      ...booth,
      name: booth.name || "",
      booth_number: booth.booth_number || "",
      is_occupied: booth.is_occupied || false,
      staff_count: booth.staff_count || 1,
      amenities: booth.amenities || "",
      image: booth.image || null,
      location: booth.location || "",
    });
    setShowUpdateModal(true);
  };

  const handleViewBooth = (booth) => {
    setSelectedBooth(booth);
    setShowViewModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewBooth((prevBooth) => ({
      ...prevBooth,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewBooth((prevBooth) => ({
        ...prevBooth,
        image: file,
      }));
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      const formData = new FormData();
      for (const key in newBooth) {
        formData.append(key, newBooth[key]);
      }

      await axios.put(`http://localhost:8000/api/exhibitor-booths/${newBooth.id}/`, formData);
      fetchBooths();
      setShowUpdateModal(false);
      showAlert("Booth updated successfully!", "success");
    } catch (error) {
      console.error("Error updating booth:", error);
      showAlert("Error updating booth", "danger");
    }
  };

  const showAlert = (message, variant) => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setTimeout(() => {
      setAlertMessage("");
    }, 3000);
  };

  // Count occupied and unoccupied booths
  const occupiedCount = booths.filter((booth) => booth.is_occupied).length;
  const unoccupiedCount = booths.length - occupiedCount;

  return (
    <div>
      {alertMessage && (
        <Alert variant={alertVariant} className="text-center">
          {alertMessage}
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Card className="p-2 me-2">
          <Card.Body>
            <Card.Title>Occupied Booths</Card.Title>
            <Card.Text>{occupiedCount}</Card.Text>
          </Card.Body>
        </Card>
        <Card className="p-2 me-2">
          <Card.Body>
            <Card.Title>Unoccupied Booths</Card.Title>
            <Card.Text>{unoccupiedCount}</Card.Text>
          </Card.Body>
        </Card>
        <ButtonGroup className="ms-auto">
          <Button variant="outline-primary" onClick={() => setViewMode("card")}>
            <FaThLarge /> Card View
          </Button>
          <Button variant="outline-primary" onClick={() => setViewMode("table")}>
            <FaThList /> Table View
          </Button>
        </ButtonGroup>
      </div>

      <div className="mb-3">
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <FaSave /> Add Booth
        </Button>
      </div>

      {viewMode === "card" ? (
        <div className="d-flex flex-wrap">
          {booths.map((booth) => (
            <Card key={booth.id} className="mb-3 me-3" style={{ width: "18rem" }}>
              {booth.image && <Card.Img variant="top" src={booth.image} alt="Booth Image" />}
              <Card.Body>
                <Card.Title>{booth.name}</Card.Title>
                <Card.Text>
                  <FaMapMarkerAlt /> {booth.location}
                </Card.Text>
                <Card.Text>
                  <FaUserTie /> {booth.staff_count} Staff
                </Card.Text>
                <div className="d-flex justify-content-between">
                  <Button variant="outline-info" onClick={() => handleViewBooth(booth)}>
                    <FaEye /> View
                  </Button>
                  <Button variant="outline-primary" onClick={() => handleUpdateBooth(booth)}>
                    <FaPen /> Edit
                  </Button>
                  <Button variant="outline-danger" onClick={() => handleDeleteBooth(booth.id)}>
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
              <th>Booth Number</th>
              <th>Occupied</th>
              <th>Staff Count</th>
              <th>Amenities</th>
              <th>Location</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {booths.map((booth, index) => (
              <tr key={booth.id}>
                <td>{index + 1}</td>
                <td>{booth.name}</td>
                <td>{booth.booth_number}</td>
                <td>{booth.is_occupied ? "Yes" : "No"}</td>
                <td>{booth.staff_count}</td>
                <td>{booth.amenities}</td>
                <td>{booth.location}</td>
                <td>
                  {booth.image && <img src={booth.image} alt="Booth Image" style={{ width: "50px" }} />}
                </td>
                <td>
                  <Button variant="outline-info" onClick={() => handleViewBooth(booth)} className="me-2">
                    <FaEye /> View
                  </Button>
                  <Button variant="outline-primary" onClick={() => handleUpdateBooth(booth)} className="me-2">
                    <FaPen /> Edit
                  </Button>
                  <Button variant="outline-danger" onClick={() => handleDeleteBooth(booth.id)}>
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
          <Modal.Title>Add Booth</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newBooth.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="booth_number">
              <Form.Label>Booth Number</Form.Label>
              <Form.Control
                type="number"
                name="booth_number"
                value={newBooth.booth_number}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="is_occupied">
              <Form.Check
                type="checkbox"
                name="is_occupied"
                label="Is Occupied"
                checked={newBooth.is_occupied}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="staff_count">
              <Form.Label>Staff Count</Form.Label>
              <Form.Control
                type="number"
                name="staff_count"
                value={newBooth.staff_count}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="amenities">
              <Form.Label>Amenities</Form.Label>
              <Form.Control
                type="text"
                name="amenities"
                value={newBooth.amenities}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleImageChange}
              />
            </Form.Group>
            <Form.Group controlId="location">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={newBooth.location}
                onChange={handleChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddBooth}>
            Add Booth
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Booth</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newBooth.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="booth_number">
              <Form.Label>Booth Number</Form.Label>
              <Form.Control
                type="number"
                name="booth_number"
                value={newBooth.booth_number}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="is_occupied">
              <Form.Check
                type="checkbox"
                name="is_occupied"
                label="Is Occupied"
                checked={newBooth.is_occupied}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="staff_count">
              <Form.Label>Staff Count</Form.Label>
              <Form.Control
                type="number"
                name="staff_count"
                value={newBooth.staff_count}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="amenities">
              <Form.Label>Amenities</Form.Label>
              <Form.Control
                type="text"
                name="amenities"
                value={newBooth.amenities}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleImageChange}
              />
            </Form.Group>
            <Form.Group controlId="location">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={newBooth.location}
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
          <Modal.Title>View Booth</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBooth && (
            <div>
              {selectedBooth.image && (
                <div className="mb-3">
                  <img src={selectedBooth.image} alt="Booth Image" className="img-fluid" />
                </div>
              )}
              <p><strong>Name:</strong> {selectedBooth.name}</p>
              <p><strong>Booth Number:</strong> {selectedBooth.booth_number}</p>
              <p><strong>Occupied:</strong> {selectedBooth.is_occupied ? "Yes" : "No"}</p>
              <p><strong>Staff Count:</strong> {selectedBooth.staff_count}</p>
              <p><strong>Amenities:</strong> {selectedBooth.amenities}</p>
              <p><strong>Location:</strong> {selectedBooth.location}</p>
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

export default ExhibitorBooths;
