import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  Modal,
  Form,
  DropdownButton,
  Dropdown,
  Alert,
  ButtonGroup,
} from "react-bootstrap";
import {
  FaSave,
  FaPen,
  FaTrash,
  FaEye,
  FaThList,
  FaThLarge,
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

// Define the sponsorship choices at the top of the file
const sponsorshipChoices = {
  "Gold - Financial": [
    "Logo placement on event website.",
    "Social media mention of the sponsor's brand.",
    "Recognition in event email newsletters.",
    "Complimentary tickets to the event.",
    "Dedicated booth space at the event."
  ],
  "Silver - Financial": [
    "Logo placement on event website.",
    "Recognition in event email newsletters.",
    "Complimentary tickets to the event.",
    "Shared booth space at the event.",
    "Mention in event press releases."
  ],
  "Bronze - Financial": [
    "Logo placement on event website.",
    "Recognition in event email newsletters.",
    "Complimentary tickets to the event.",
    "Shared booth space at the event."
  ],
  "Platinum - Financial": [
    "Prime logo placement on event website.",
    "Social media spotlight of the sponsor's brand.",
    "Featured mention in event email newsletters.",
    "VIP access to event activities.",
    "Exclusive booth space at the event."
  ],
  "Diamond - Financial": [
    "Exclusive logo placement on event website.",
    "Social media feature of the sponsor's brand.",
    "Premier mention in event email newsletters.",
    "VIP access to event activities.",
    "Exclusive booth space at the event.",
    "Speaking opportunity at the event."
  ],
  "Custom - Financial": [
    "Tailored benefits based on negotiated terms.",
    "Customized marketing and branding opportunities.",
    "Flexibility in choosing event involvement options.",
    "Personalized recognition during the event."
  ],
  "Gold - In-kind": [
    "Product placement in event promotional materials.",
    "Inclusion of sponsor's products in event giveaways.",
    "Recognition on event signage and banners.",
    "Opportunity to provide branded merchandise to event attendees."
  ],
  "Silver - In-kind": [
    "Product placement in event promotional materials.",
    "Inclusion of sponsor's products in event giveaways.",
    "Recognition on event signage and banners.",
    "Opportunity to provide branded merchandise to event attendees."
  ],
  "Bronze - In-kind": [
    "Product placement in event promotional materials.",
    "Inclusion of sponsor's products in event giveaways.",
    "Recognition on event signage and banners."
  ],
  "Platinum - In-kind": [
    "Exclusive product placement in event promotional materials.",
    "Premium inclusion of sponsor's products in event giveaways.",
    "Prominent recognition on event signage and banners.",
    "VIP access to event activities."
  ],
  "Diamond - In-kind": [
    "Premier product placement in event promotional materials.",
    "Exclusive inclusion of sponsor's products in event giveaways.",
    "Prominent recognition on event signage and banners.",
    "VIP access to event activities.",
    "Speaking opportunity at the event."
  ],
  "Custom - In-kind": [
    "Tailored product placement and recognition opportunities.",
    "Flexibility in choosing product integration options.",
    "Customized branding and marketing strategies.",
    "Personalized engagement with event attendees."
  ]
};

const Sponsors = () => {
  const [sponsors, setSponsors] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedSponsor, setSelectedSponsor] = useState(null);
  const [newSponsor, setNewSponsor] = useState({
    name: "",
    description: "",
    packages: "",
    logo: null,
    website: "",
    contact_email: "",
    contact_phone: "",
    agreement_signed: false,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [viewMode, setViewMode] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUtilities, setShowUtilities] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("");

  useEffect(() => {
    fetchSponsors();
  }, []);

  const fetchSponsors = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/sponsors/");
      if (response.ok) {
        const data = await response.json();
        setSponsors(data);
      } else {
        console.error("Error fetching sponsors:", response.status);
      }
    } catch (error) {
      console.error("Error fetching sponsors:", error);
    }
  };

  const handleAddSponsor = async () => {
    try {
      const formData = new FormData();
      for (const key in newSponsor) {
        formData.append(key, newSponsor[key]);
      }

      const response = await fetch("http://127.0.0.1:8000/api/sponsors/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        fetchSponsors();
        setShowAddModal(false);
        setSuccessMessage("Sponsor added successfully!");
        setNewSponsor({
          name: "",
          description: "",
          packages: "",
          logo: null,
          website: "",
          contact_email: "",
          contact_phone: "",
          agreement_signed: false,
        });
      } else {
        console.error("Error adding sponsor:", response.status);
      }
    } catch (error) {
      console.error("Error adding sponsor:", error);
    }
  };

  const handleDeleteSponsor = async (sponsorId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/sponsors/${sponsorId}/`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        fetchSponsors();
        setSuccessMessage("Sponsor deleted successfully!");
      } else {
        console.error("Error deleting sponsor:", response.status);
      }
    } catch (error) {
      console.error("Error deleting sponsor:", error);
    }
  };

  const handleViewDetails = (sponsor) => {
    setSelectedSponsor(sponsor);
    setShowDetailsModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSponsor((prevSponsor) => ({
      ...prevSponsor,
      [name]: value,
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewSponsor((prevSponsor) => ({
        ...prevSponsor,
        logo: file,
      }));
    }
  };

  const handleViewUtilities = () => {
    setShowUtilities(true);
    setSelectedPackage("");
  };

  const handleSelectPackage = (packageName) => {
    setSelectedPackage(packageName);
  };

  const filteredSponsors = sponsors.filter((sponsor) =>
    sponsor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getBenefits = (packageName) => {
    return sponsorshipChoices[packageName] || [];
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="main-heading">Secure Your Sponsorship Today</h1>
        <DropdownButton id="dropdown-basic-button" title="Options" variant="secondary">
          <Dropdown.Item onClick={fetchSponsors}>View All Sponsors</Dropdown.Item>
          <Dropdown.Item onClick={() => setShowAddModal(true)}>Add Sponsor</Dropdown.Item>
          <Dropdown.Item onClick={handleViewUtilities}>View Utility</Dropdown.Item>
        </DropdownButton>
      </div>

      {/* <div className="text-center mb-4">
        <img src="src/img/sss.jpg" alt="Sponsors" style={{ maxWidth: "100%" }} />
      </div> */}

      <Form.Control
        type="text"
        placeholder="Search Sponsors..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-3"
      />

      <ButtonGroup className="mb-3">
        <Button variant="outline-primary" onClick={() => setViewMode("card")}>
          <FaThLarge /> Card View
        </Button>
        <Button variant="outline-primary" onClick={() => setViewMode("table")}>
          <FaThList /> Table View
        </Button>
      </ButtonGroup>

      {successMessage && <Alert variant="success">{successMessage}</Alert>}

      {!showUtilities ? (
        viewMode === "card" ? (
          <div className="d-flex flex-wrap">
            {filteredSponsors.map((sponsor) => (
              <Card key={sponsor.id} className="mb-3 me-3" style={{ width: "18rem" }}>
                {sponsor.logo && <Card.Img variant="top" src={sponsor.logo} alt={sponsor.name} />}
                <Card.Body>
                  <Card.Title>{sponsor.name}</Card.Title>
                  <Card.Text>{sponsor.description}</Card.Text>
                  <Card.Text>
                    <FaGlobe /> Website: <a href={sponsor.website}>{sponsor.website}</a>
                  </Card.Text>
                  <Card.Text>
                    <FaEnvelope /> Contact Email: {sponsor.contact_email}
                  </Card.Text>
                  <Button variant="primary" onClick={() => handleViewDetails(sponsor)}>
                    <FaEye /> View Details
                  </Button>{" "}
                  <Button variant="danger" onClick={() => handleDeleteSponsor(sponsor.id)}>
                    <FaTrash /> Delete
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </div>
        ) : (
          <Table striped bordered hover responsive className="mb-4" style={{ overflowX: "auto" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Packages</th>
                <th>Website</th>
                <th>Contact Email</th>
                <th>Contact Phone</th>
                <th>Agreement Signed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSponsors.map((sponsor) => (
                <tr key={sponsor.id}>
                  <td>{sponsor.id}</td>
                  <td>{sponsor.name}</td>
                  <td>{sponsor.description}</td>
                  <td>{sponsor.packages}</td>
                  <td>{sponsor.website}</td>
                  <td>{sponsor.contact_email}</td>
                  <td>{sponsor.contact_phone}</td>
                  <td>{sponsor.agreement_signed ? <FaCheck /> : <FaTimes />}</td>
                  <td>
                    <Button variant="primary" size="sm" onClick={() => handleViewDetails(sponsor)}>
                      <FaEye />
                    </Button>{" "}
                    <Button variant="danger" size="sm" onClick={() => handleDeleteSponsor(sponsor.id)}>
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )
      ) : (
        <div>
          <h2 className="mb-4">Select a Package to View Utilities</h2>
          <Form.Control
            as="select"
            value={selectedPackage}
            onChange={(e) => handleSelectPackage(e.target.value)}
            className="mb-4"
          >
            <option value="">Select a package</option>
            {Object.keys(sponsorshipChoices).map((key) => (
              <option key={key} value={key}>
                {key}
              </option>
            ))}
          </Form.Control>

          {selectedPackage && (
            <>
              <h3>{selectedPackage} - Utilities</h3>
              <ul>
                {getBenefits(selectedPackage).map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </>
          )}

          <Button variant="secondary" onClick={() => setShowUtilities(false)}>
            Back to Sponsors
          </Button>
        </div>
      )}

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Sponsor</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={newSponsor.name}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={newSponsor.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="packages">
              <Form.Label>Packages</Form.Label>
              <Form.Control
                as="select"
                name="packages"
                value={newSponsor.packages}
                onChange={handleChange}
              >
                <option value="">Select a package</option>
                {Object.keys(sponsorshipChoices).map((key) => (
                  <option key={key} value={key}>
                    {key}
                  </option>
                ))}
              </Form.Control>
              {newSponsor.packages && (
                <ul>
                  {getBenefits(newSponsor.packages).map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="logo">
              <Form.Label>Logo</Form.Label>
              <Form.Control type="file" name="logo" onChange={handleLogoChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="website">
              <Form.Label>Website</Form.Label>
              <Form.Control
                type="text"
                name="website"
                value={newSponsor.website}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="contact_email">
              <Form.Label>Contact Email</Form.Label>
              <Form.Control
                type="email"
                name="contact_email"
                value={newSponsor.contact_email}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="contact_phone">
              <Form.Label>Contact Phone</Form.Label>
              <Form.Control
                type="text"
                name="contact_phone"
                value={newSponsor.contact_phone}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="agreement_signed">
              <Form.Check
                type="checkbox"
                label="Agreement Signed"
                name="agreement_signed"
                checked={newSponsor.agreement_signed}
                onChange={(e) =>
                  setNewSponsor((prevSponsor) => ({
                    ...prevSponsor,
                    agreement_signed: e.target.checked,
                  }))
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddSponsor}>
            <FaSave /> Save
          </Button>
        </Modal.Footer>
      </Modal>

      {selectedSponsor && (
        <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Sponsor Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card>
              {selectedSponsor.logo && (
                <Card.Img variant="top" src={selectedSponsor.logo} alt={selectedSponsor.name} />
              )}
              <Card.Body>
                <Card.Title>{selectedSponsor.name}</Card.Title>
                <Card.Text>{selectedSponsor.description}</Card.Text>
                <Card.Text>
                  <FaGlobe /> Website: <a href={selectedSponsor.website}>{selectedSponsor.website}</a>
                </Card.Text>
                <Card.Text>
                  <FaEnvelope /> Contact Email: {selectedSponsor.contact_email}
                </Card.Text>
                <Card.Text>
                  <FaPhone /> Contact Phone: {selectedSponsor.contact_phone}
                </Card.Text>
                <Card.Text>Packages: {selectedSponsor.packages}</Card.Text>
                {selectedSponsor.packages && (
                  <ul>
                    {getBenefits(selectedSponsor.packages).map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                )}
                <Card.Text>
                  Agreement Signed: {selectedSponsor.agreement_signed ? <FaCheck /> : <FaTimes />}
                </Card.Text>
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default Sponsors;
