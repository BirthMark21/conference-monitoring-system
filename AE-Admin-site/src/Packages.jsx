import React, { useState, useEffect } from "react";
import { Table, Card, Button, Modal, Form, DropdownButton, Dropdown, Alert, ButtonGroup } from "react-bootstrap";
import { FaSave, FaPen, FaTrash, FaFilter, FaThList, FaThLarge, FaCheck, FaTimes, FaLink } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Packages = () => {
  const [sponsorships, setSponsorships] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedSponsorship, setSelectedSponsorship] = useState(null);
  const [newSponsorship, setNewSponsorship] = useState({
    sponsorship_type_and_level: "",
    fee: "",
    agreement_signed: false,
    start_date: "",
    end_date: "",
    image: null,
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [viewMode, setViewMode] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");

  const sponsorshipChoices = [
    "Gold - Financial",
    "Silver - Financial",
    "Bronze - Financial",
    "Platinum - Financial",
    "Diamond - Financial",
    "Gold - In-kind",
    "Silver - In-kind",
    "Bronze - In-kind",
    "Platinum - In-kind",
    "Diamond - In-kind"
  ];

  useEffect(() => {
    fetchSponsorships();
  }, []);

  const fetchSponsorships = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/sponsorships/");
      if (response.ok) {
        const data = await response.json();
        setSponsorships(data);
      } else {
        console.error("Error fetching sponsorships:", response.status);
      }
    } catch (error) {
      console.error("Error fetching sponsorships:", error);
    }
  };

  const handleAddSponsorship = async () => {
    try {
      const formData = new FormData();
      for (const key in newSponsorship) {
        formData.append(key, newSponsorship[key]);
      }

      const response = await fetch("http://127.0.0.1:8000/api/sponsorships/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        fetchSponsorships();
        setShowAddModal(false);
        showAlert("Sponsorship added successfully!", "success");
      } else {
        console.error("Error adding sponsorship:", response.status);
        showAlert("Error adding sponsorship", "danger");
      }
    } catch (error) {
      console.error("Error adding sponsorship:", error);
      showAlert("Error adding sponsorship", "danger");
    }
  };

  const handleDeleteSponsorship = async (sponsorshipId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/sponsorships/${sponsorshipId}/`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchSponsorships();
        showAlert("Sponsorship deleted successfully!", "success");
      } else {
        console.error("Error deleting sponsorship:", response.status);
        showAlert("Error deleting sponsorship", "danger");
      }
    } catch (error) {
      console.error("Error deleting sponsorship:", error);
      showAlert("Error deleting sponsorship", "danger");
    }
  };

  const handleUpdateSponsorship = (sponsorship) => {
    setSelectedSponsorship(sponsorship);
    setNewSponsorship({
      ...sponsorship,
      fee: sponsorship.fee || "",
      agreement_signed: sponsorship.agreement_signed || false,
      start_date: sponsorship.start_date || "",
      end_date: sponsorship.end_date || "",
    });
    setShowUpdateModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSponsorship((prevSponsorship) => ({
      ...prevSponsorship,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewSponsorship((prevSponsorship) => ({
        ...prevSponsorship,
        image: file,
      }));
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      const formData = new FormData();
      for (const key in newSponsorship) {
        formData.append(key, newSponsorship[key]);
      }

      const response = await fetch(`http://127.0.0.1:8000/api/sponsorships/${newSponsorship.id}/`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        fetchSponsorships();
        setShowUpdateModal(false);
        showAlert("Sponsorship updated successfully!", "success");
      } else {
        console.error("Error updating sponsorship:", response.status);
        showAlert("Error updating sponsorship", "danger");
      }
    } catch (error) {
      console.error("Error updating sponsorship:", error);
      showAlert("Error updating sponsorship", "danger");
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredSponsorships = sponsorships.filter((sponsorship) =>
    (sponsorship.sponsorship_type_and_level || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const countByType = (type) => {
    return sponsorships.filter((sponsorship) => (sponsorship.sponsorship_type_and_level || "").includes(type)).length;
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
        <div className="d-flex justify-content-around mb-3">
        <Button variant="link" href="/sponsors">
          <FaLink /> Track Sponsor
        </Button>
        <Button variant="link" href="/exhibitor-booths">
          <FaLink /> Manage Exhibitor Booth
        </Button>
        <Button variant="link" href="/exhibitors">
          <FaLink /> Manage Exhibitor
        </Button>
        <Button variant="link" href="/sessions">
          <FaLink /> Manage Sessions
        </Button>
      </div>
      {alertMessage && (
        <Alert variant={alertVariant} className="text-center">
          {alertMessage}
        </Alert>
      )}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <Card className="flex-grow-1 me-2">
          <Card.Body>
            <Card.Text>
              <FaCheck /> Gold Sponsorships: {countByType("Gold")}
            </Card.Text>
          </Card.Body>
        </Card>
        <Card className="flex-grow-1 ms-2">
          <Card.Body>
            <Card.Text>
              <FaTimes /> Silver Sponsorships: {countByType("Silver")}
            </Card.Text>
          </Card.Body>
        </Card>
        <DropdownButton id="dropdown-basic-button" title="Filter Sponsorships" size="sm" className="ms-auto">
          <Dropdown.Item onClick={() => setSearchQuery("Gold")}>Gold</Dropdown.Item>
          <Dropdown.Item onClick={() => setSearchQuery("Silver")}>Silver</Dropdown.Item>
          <Dropdown.Item onClick={() => setSearchQuery("Bronze")}>Bronze</Dropdown.Item>
          <Dropdown.Item onClick={() => setSearchQuery("Platinum")}>Platinum</Dropdown.Item>
          <Dropdown.Item onClick={() => setSearchQuery("Diamond")}>Diamond</Dropdown.Item>
          <Dropdown.Item onClick={() => setSearchQuery("")}>All</Dropdown.Item>
        </DropdownButton>
        <ButtonGroup className="ms-3">
          <Button variant="outline-primary" onClick={() => setViewMode("card")}>
            <FaThLarge /> Card View
          </Button>
          <Button variant="outline-primary" onClick={() => setViewMode("table")}>
            <FaThList /> Table View
          </Button>
        </ButtonGroup>
      </div>

      <Form.Control
        type="text"
        placeholder="Search Sponsorships..."
        value={searchQuery}
        onChange={handleSearch}
        className="mb-3"
      />

      <Button variant="primary" onClick={() => setShowAddModal(true)} className="mb-3">
        <FaSave /> Add Sponsorship
      </Button>

     
      {viewMode === "card" ? (
        <div className="d-flex flex-wrap">
          {filteredSponsorships.map((sponsorship) => (
            <Card key={sponsorship.id} className="mb-3 me-3" style={{ width: "18rem" }}>
              {sponsorship.image && (
                <Card.Img variant="top" src={sponsorship.image} alt="Sponsorship Image" />
              )}
              <Card.Body>
                <Card.Title>{sponsorship.sponsorship_type_and_level}</Card.Title>
                <Card.Text>Fee: {sponsorship.fee}</Card.Text>
                <Card.Text>
                  Agreement Signed: {sponsorship.agreement_signed ? "Yes" : "No"}
                </Card.Text>
                <Card.Text>Start Date: {sponsorship.start_date}</Card.Text>
                <Card.Text>End Date: {sponsorship.end_date}</Card.Text>
                <div className="d-flex justify-content-between">
                  <Button variant="outline-primary" onClick={() => handleUpdateSponsorship(sponsorship)}>
                    <FaPen /> Edit
                  </Button>
                  <Button variant="outline-danger" onClick={() => handleDeleteSponsorship(sponsorship.id)}>
                    <FaTrash /> Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Type and Level</th>
              <th>Fee</th>
              <th>Agreement Signed</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSponsorships.map((sponsorship) => (
              <tr key={sponsorship.id}>
                <td>{sponsorship.sponsorship_type_and_level}</td>
                <td>{sponsorship.fee}</td>
                <td>{sponsorship.agreement_signed ? "Yes" : "No"}</td>
                <td>{sponsorship.start_date}</td>
                <td>{sponsorship.end_date}</td>
                <td>
                  <Button variant="outline-primary" onClick={() => handleUpdateSponsorship(sponsorship)}>
                    <FaPen /> Edit
                  </Button>
                  <Button variant="outline-danger" onClick={() => handleDeleteSponsorship(sponsorship.id)}>
                    <FaTrash /> Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Add Sponsorship Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Sponsorship</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Sponsorship Type and Level</Form.Label>
              <Form.Control
                as="select"
                name="sponsorship_type_and_level"
                value={newSponsorship.sponsorship_type_and_level}
                onChange={handleChange}
              >
                <option value="">Select Type and Level</option>
                {sponsorshipChoices.map((choice, index) => (
                  <option key={index} value={choice}>
                    {choice}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Fee</Form.Label>
              <Form.Control
                type="number"
                name="fee"
                value={newSponsorship.fee}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Agreement Signed</Form.Label>
              <Form.Check
                type="checkbox"
                name="agreement_signed"
                checked={newSponsorship.agreement_signed}
                onChange={(e) =>
                  setNewSponsorship((prevSponsorship) => ({
                    ...prevSponsorship,
                    agreement_signed: e.target.checked,
                  }))
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="start_date"
                value={newSponsorship.start_date}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="end_date"
                value={newSponsorship.end_date}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" onChange={handleImageChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddSponsorship}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Sponsorship Modal */}
      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Sponsorship</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Sponsorship Type and Level</Form.Label>
              <Form.Control
                as="select"
                name="sponsorship_type_and_level"
                value={newSponsorship.sponsorship_type_and_level}
                onChange={handleChange}
              >
                <option value="">Select Type and Level</option>
                {sponsorshipChoices.map((choice, index) => (
                  <option key={index} value={choice}>
                    {choice}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Fee</Form.Label>
              <Form.Control
                type="number"
                name="fee"
                value={newSponsorship.fee}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Agreement Signed</Form.Label>
              <Form.Check
                type="checkbox"
                name="agreement_signed"
                checked={newSponsorship.agreement_signed}
                onChange={(e) =>
                  setNewSponsorship((prevSponsorship) => ({
                    ...prevSponsorship,
                    agreement_signed: e.target.checked,
                  }))
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <Form.Control
                type="date"
                name="start_date"
                value={newSponsorship.start_date}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>End Date</Form.Label>
              <Form.Control
                type="date"
                name="end_date"
                value={newSponsorship.end_date}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Image</Form.Label>
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

export default Packages;
