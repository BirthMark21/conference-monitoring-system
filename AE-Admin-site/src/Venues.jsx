import React, { useState, useEffect } from "react";
import { Table, Card, Button, Modal, Form, Alert, ButtonGroup } from "react-bootstrap";
import { FaSave, FaPen, FaTrash, FaThList, FaThLarge, FaEye, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [newVenue, setNewVenue] = useState({
    name: "",
    location: "",
    description: "",
    capacity: "",
    facilities: "",
    number_of_rooms: "",
    is_accessible: true,
    parking: false,
    contact_person_name: "",
    contact_email: "",
    contact_phone: "",
    package_deals: "",
    nearby_accommodations: false,
    image: null,
    discount: "",
    rent_price: "",
    country: "",
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [viewMode, setViewMode] = useState("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAccessible, setFilterAccessible] = useState(false);

  const countries = ["United States", "Canada", "United Kingdom", "Australia", "Germany", "France", "India", "China", "Japan", "South Korea", "Ethiopia", "Brazil", "Mexico", "Russia", "Italy", "Spain", "Netherlands", "Sweden", "Switzerland", "South Africa", "Egypt", "Nigeria", "Kenya", "Argentina", "Chile", "Colombia", "Peru", "New Zealand", "Singapore", "Thailand", "Vietnam", "Malaysia", "Philippines", "Indonesia", "Saudi Arabia", "Turkey", "Israel", "UAE", "Qatar", "Kuwait", "Norway", "Finland", "Denmark", "Belgium", "Austria", "Portugal", "Ireland", "Poland", "Greece", "Czech Republic", "Hungary"];

  useEffect(() => {
    fetchVenues();
  }, []);

  const fetchVenues = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/venues/");
      if (response.ok) {
        const data = await response.json();
        setVenues(data);
      } else {
        console.error("Error fetching venues:", response.status);
      }
    } catch (error) {
      console.error("Error fetching venues:", error);
    }
  };

  const handleAddVenue = async () => {
    try {
      const formData = new FormData();
      for (const key in newVenue) {
        formData.append(key, newVenue[key]);
      }

      const response = await fetch("http://127.0.0.1:8000/api/venues/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        fetchVenues();
        setShowAddModal(false);
        showAlert("Venue added successfully!", "success");
      } else {
        console.error("Error adding venue:", response.status);
        showAlert("Error adding venue", "danger");
      }
    } catch (error) {
      console.error("Error adding venue:", error);
      showAlert("Error adding venue", "danger");
    }
  };

  const handleDeleteVenue = async (venueId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/venues/${venueId}/`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchVenues();
        showAlert("Venue deleted successfully!", "success");
      } else {
        console.error("Error deleting venue:", response.status);
        showAlert("Error deleting venue", "danger");
      }
    } catch (error) {
      console.error("Error deleting venue:", error);
      showAlert("Error deleting venue", "danger");
    }
  };

  const handleUpdateVenue = (venue) => {
    setSelectedVenue(venue);
    setNewVenue({
      ...venue,
      name: venue.name || "",
      location: venue.location || "",
      description: venue.description || "",
      capacity: venue.capacity || "",
      facilities: venue.facilities || "",
      number_of_rooms: venue.number_of_rooms || "",
      is_accessible: venue.is_accessible || false,
      parking: venue.parking || false,
      contact_person_name: venue.contact_person_name || "",
      contact_email: venue.contact_email || "",
      contact_phone: venue.contact_phone || "",
      package_deals: venue.package_deals || "",
      nearby_accommodations: venue.nearby_accommodations || false,
      discount: venue.discount || "",
      rent_price: venue.rent_price || "",
      country: venue.country || "",
    });
    setShowUpdateModal(true);
  };

  const handleViewVenue = (venue) => {
    setSelectedVenue(venue);
    setShowViewModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewVenue((prevVenue) => ({
      ...prevVenue,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewVenue((prevVenue) => ({
        ...prevVenue,
        image: file,
      }));
    }
  };

  const handleUpdateSubmit = async () => {
    try {
      const formData = new FormData();
      for (const key in newVenue) {
        formData.append(key, newVenue[key]);
      }

      const response = await fetch(`http://127.0.0.1:8000/api/venues/${newVenue.id}/`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        fetchVenues();
        setShowUpdateModal(false);
        showAlert("Venue updated successfully!", "success");
      } else {
        console.error("Error updating venue:", response.status);
        showAlert("Error updating venue", "danger");
      }
    } catch (error) {
      console.error("Error updating venue:", error);
      showAlert("Error updating venue", "danger");
    }
  };

  const showAlert = (message, variant) => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setTimeout(() => {
      setAlertMessage("");
    }, 3000);
  };

  const filteredVenues = venues.filter(venue =>
    venue.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    venue.location.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!filterAccessible || venue.is_accessible)
  );

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

      <Button variant="primary" onClick={() => setShowAddModal(true)} className="mb-3" style={{ padding: "0.25rem 0.5rem" }}>
        <FaSave /> Add Venue
      </Button>

      <Form.Control
        type="text"
        placeholder="Search by name or location"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="mb-3"
      />

      <Form.Check
        type="checkbox"
        label="Accessible"
        checked={filterAccessible}
        onChange={(e) => setFilterAccessible(e.target.checked)}
        className="mb-3"
      />

      {viewMode === "card" ? (
        <div className="d-flex flex-wrap">
          {filteredVenues.map((venue) => (
            <Card key={venue.id} className="mb-3 me-3" style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title>{venue.name}</Card.Title>
                <Card.Text>
                  <FaMapMarkerAlt /> {venue.location}
                </Card.Text>
                {venue.image && <img src={venue.image} alt="Venue" style={{ width: "100%", height: "150px", objectFit: "cover" }} />}
                <div className="d-flex justify-content-between mt-2">
                  <Button variant="outline-info" onClick={() => handleViewVenue(venue)}>
                    <FaEye /> View
                  </Button>
                  <Button variant="outline-secondary" onClick={() => handleUpdateVenue(venue)}>
                    <FaPen /> Edit
                  </Button>
                  <Button variant="outline-danger" onClick={() => handleDeleteVenue(venue.id)}>
                    <FaTrash /> Delete
                  </Button>
                </div>
                <div className="mt-2">
                  <strong>Discount: ${venue.discount}</strong>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Location</th>
              <th>Description</th>
              <th>Capacity</th>
              <th>Facilities</th>
              <th>Accessible</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVenues.map((venue) => (
              <tr key={venue.id}>
                <td>{venue.name}</td>
                <td>{venue.location}</td>
                <td>{venue.description}</td>
                <td>{venue.capacity}</td>
                <td>{venue.facilities}</td>
                <td>{venue.is_accessible ? "Yes" : "No"}</td>
                <td>
                  <Button variant="outline-info" onClick={() => handleViewVenue(venue)} style={{ padding: "0.25rem 0.5rem" }}>
                    <FaEye /> View
                  </Button>
                  <Button variant="outline-secondary" onClick={() => handleUpdateVenue(venue)} style={{ padding: "0.25rem 0.5rem" }}>
                    <FaPen /> Edit
                  </Button>
                  <Button variant="outline-danger" onClick={() => handleDeleteVenue(venue.id)} style={{ padding: "0.25rem 0.5rem" }}>
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
          <Modal.Title>Add Venue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="d-flex">
              <div className="me-2" style={{ flex: 1 }}>
                <Form.Group controlId="formVenueName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={newVenue.name}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVenueLocation">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={newVenue.location}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVenueDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={newVenue.description}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVenueCapacity">
                  <Form.Label>Capacity</Form.Label>
                  <Form.Control
                    type="number"
                    name="capacity"
                    value={newVenue.capacity}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVenueFacilities">
                  <Form.Label>Facilities</Form.Label>
                  <Form.Control
                    type="text"
                    name="facilities"
                    value={newVenue.facilities}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVenueNumberOfRooms">
                  <Form.Label>Number of Rooms</Form.Label>
                  <Form.Control
                    type="number"
                    name="number_of_rooms"
                    value={newVenue.number_of_rooms}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVenueCountry">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    as="select"
                    name="country"
                    value={newVenue.country}
                    onChange={handleChange}
                  >
                    {countries.map((country, index) => (
                      <option key={index} value={country}>
                        {country}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </div>
              <div className="ms-2" style={{ flex: 1 }}>
                <Form.Group controlId="formVenueIsAccessible">
                  <Form.Label>Accessible</Form.Label>
                  <Form.Check
                    type="checkbox"
                    name="is_accessible"
                    checked={newVenue.is_accessible}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVenueParking">
                  <Form.Label>Parking</Form.Label>
                  <Form.Check
                    type="checkbox"
                    name="parking"
                    checked={newVenue.parking}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVenueContactPersonName">
                  <Form.Label>Contact Person Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact_person_name"
                    value={newVenue.contact_person_name}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVenueContactEmail">
                  <Form.Label>Contact Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="contact_email"
                    value={newVenue.contact_email}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVenueContactPhone">
                  <Form.Label>Contact Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact_phone"
                    value={newVenue.contact_phone}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVenuePackageDeals">
                  <Form.Label>Package Deals</Form.Label>
                  <Form.Control
                    type="text"
                    name="package_deals"
                    value={newVenue.package_deals}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVenueNearbyAccommodations">
                  <Form.Label>Nearby Accommodations</Form.Label>
                  <Form.Check
                    type="checkbox"
                    name="nearby_accommodations"
                    checked={newVenue.nearby_accommodations}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVenueImage">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVenueDiscount">
                  <Form.Label>Discount ($)</Form.Label>
                  <Form.Control
                    type="number"
                    name="discount"
                    value={newVenue.discount}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVenueRentPrice">
                  <Form.Label>Rent Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="rent_price"
                    value={newVenue.rent_price}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddVenue}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Venue</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <div className="d-flex">
              <div className="me-2" style={{ flex: 1 }}>
                <Form.Group controlId="formVenueName">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={newVenue.name}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVenueLocation">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={newVenue.location}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVenueDescription">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={newVenue.description}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVenueCapacity">
                  <Form.Label>Capacity</Form.Label>
                  <Form.Control
                    type="number"
                    name="capacity"
                    value={newVenue.capacity}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVenueFacilities">
                  <Form.Label>Facilities</Form.Label>
                  <Form.Control
                    type="text"
                    name="facilities"
                    value={newVenue.facilities}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVenueNumberOfRooms">
                  <Form.Label>Number of Rooms</Form.Label>
                  <Form.Control
                    type="number"
                    name="number_of_rooms"
                    value={newVenue.number_of_rooms}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVenueCountry">
                  <Form.Label>Country</Form.Label>
                  <Form.Control
                    as="select"
                    name="country"
                    value={newVenue.country}
                    onChange={handleChange}
                  >
                    {countries.map((country, index) => (
                      <option key={index} value={country}>
                        {country}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </div>
              <div className="ms-2" style={{ flex: 1 }}>
                <Form.Group controlId="formVenueIsAccessible">
                  <Form.Label>Accessible</Form.Label>
                  <Form.Check
                    type="checkbox"
                    name="is_accessible"
                    checked={newVenue.is_accessible}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVenueParking">
                  <Form.Label>Parking</Form.Label>
                  <Form.Check
                    type="checkbox"
                    name="parking"
                    checked={newVenue.parking}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVenueContactPersonName">
                  <Form.Label>Contact Person Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact_person_name"
                    value={newVenue.contact_person_name}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVenueContactEmail">
                  <Form.Label>Contact Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="contact_email"
                    value={newVenue.contact_email}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVenueContactPhone">
                  <Form.Label>Contact Phone</Form.Label>
                  <Form.Control
                    type="text"
                    name="contact_phone"
                    value={newVenue.contact_phone}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVenuePackageDeals">
                  <Form.Label>Package Deals</Form.Label>
                  <Form.Control
                    type="text"
                    name="package_deals"
                    value={newVenue.package_deals}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVenueNearbyAccommodations">
                  <Form.Label>Nearby Accommodations</Form.Label>
                  <Form.Check
                    type="checkbox"
                    name="nearby_accommodations"
                    checked={newVenue.nearby_accommodations}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVenueImage">
                  <Form.Label>Image</Form.Label>
                  <Form.Control
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVenueDiscount">
                  <Form.Label>Discount ($)</Form.Label>
                  <Form.Control
                    type="number"
                    name="discount"
                    value={newVenue.discount}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="formVenueRentPrice">
                  <Form.Label>Rent Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="rent_price"
                    value={newVenue.rent_price}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateVenue}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Venues;
