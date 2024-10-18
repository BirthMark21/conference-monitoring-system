import React, { useState, useEffect } from "react";
import { Table, Card, Button, Modal, Form, Alert, ButtonGroup, Dropdown } from "react-bootstrap";
import { FaSave, FaPen, FaTrash, FaThList, FaThLarge, FaAlignLeft, FaSortNumericDown, FaDollarSign, FaCube, FaEye, FaTags, FaImage } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

const Showcase = () => {
  const [showcaseItems, setShowcaseItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    price: "",
    quantity_available: "",
    status: "available",
    sold_at: "",
    image: null,
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  const [viewMode, setViewMode] = useState("card");

  useEffect(() => {
    fetchShowcaseItems();
  }, []);

  const fetchShowcaseItems = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/showcase-items/");
      if (response.ok) {
        const data = await response.json();
        setShowcaseItems(data);
        setFilteredItems(data);
      } else {
        console.error("Error fetching showcase items:", response.status);
      }
    } catch (error) {
      console.error("Error fetching showcase items:", error);
    }
  };

  const getStatusCounts = () => {
    const statusCounts = showcaseItems.reduce((acc, item) => {
      acc[item.status] = (acc[item.status] || 0) + 1;
      return acc;
    }, {});
    return statusCounts;
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
    if (status) {
      setFilteredItems(showcaseItems.filter(item => item.status === status));
    } else {
      setFilteredItems(showcaseItems);
    }
  };

  const handleAddItem = async () => {
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      for (const key in newItem) {
        formData.append(key, newItem[key]);
      }

      const response = await fetch("http://127.0.0.1:8000/api/showcase-items/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        fetchShowcaseItems();
        setShowAddModal(false);
        showAlert("Item added successfully!", "success");
      } else {
        console.error("Error adding item:", response.status);
        showAlert("Error adding item", "danger");
      }
    } catch (error) {
      console.error("Error adding item:", error);
      showAlert("Error adding item", "danger");
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/showcase-items/${itemId}/`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchShowcaseItems();
        showAlert("Item deleted successfully!", "success");
      } else {
        console.error("Error deleting item:", response.status);
        showAlert("Error deleting item", "danger");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      showAlert("Error deleting item", "danger");
    }
  };

  const handleUpdateItem = (item) => {
    setSelectedItem(item);
    setNewItem({
      ...item,
      name: item.name || "",
      description: item.description || "",
      price: item.price || "",
      quantity_available: item.quantity_available || "",
      status: item.status || "available",
      sold_at: item.sold_at || "",
    });
    setShowUpdateModal(true);
  };

  const handleViewItem = (item) => {
    setSelectedItem(item);
    setShowViewModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewItem((prevItem) => ({
        ...prevItem,
        image: file,
      }));
    }
  };

  const handleUpdateSubmit = async () => {
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      for (const key in newItem) {
        formData.append(key, newItem[key]);
      }

      const response = await fetch(`http://127.0.0.1:8000/api/showcase-items/${newItem.id}/`, {
        method: "PUT",
        body: formData,
      });

      if (response.ok) {
        fetchShowcaseItems();
        setShowUpdateModal(false);
        showAlert("Item updated successfully!", "success");
      } else {
        console.error("Error updating item:", response.status);
        showAlert("Error updating item", "danger");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      showAlert("Error updating item", "danger");
    }
  };

  const showAlert = (message, variant) => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setTimeout(() => {
      setAlertMessage("");
    }, 3000);
  };

  const validateForm = () => {
    if (!newItem.name || !newItem.price || !newItem.quantity_available || !newItem.status) {
      showAlert("Please fill in all required fields", "danger");
      return false;
    }
    return true;
  };

  const statusCounts = getStatusCounts();

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
        <Dropdown className="ms-3">
          <Dropdown.Toggle variant="outline-primary">
            <FaTags /> Filter by Status
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={() => handleFilterChange("")}>All</Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilterChange("available")}>
              Available ({statusCounts.available || 0})
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilterChange("sold")}>
              Sold ({statusCounts.sold || 0})
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilterChange("on_process")}>
              On Process ({statusCounts.on_process || 0})
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleFilterChange("not_on_market")}>
              Not On Market ({statusCounts.not_on_market || 0})
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => setShowAddModal(true)}>
              <FaSave /> Add Showcase Item
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {viewMode === "card" ? (
        <div className="d-flex flex-wrap">
          {filteredItems.map((item) => (
            <Card key={item.id} className="mb-3 me-3" style={{ width: "18rem" }}>
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                {item.image && (
                  <Card.Img variant="top" src={item.image} alt="Item Image" />
                )}
                <Card.Text>{item.description}</Card.Text>
                <Card.Text><FaDollarSign />{item.price}</Card.Text>
                {/* <Card.Text><FaCube /> Quantity Available: {item.quantity_available}</Card.Text>
                <Card.Text><FaTags /> Status: {item.status}</Card.Text>
                <Card.Text><FaSortNumericDown /> Sold At: {item.sold_at ? new Date(item.sold_at).toLocaleString() : 'N/A'}</Card.Text> */}
                <div className="d-flex justify-content-between">
                  <Button variant="outline-info" onClick={() => handleViewItem(item)}>
                    <FaEye /> View
                  </Button>
                  <Button variant="outline-primary" onClick={() => handleUpdateItem(item)}>
                    <FaPen /> Edit
                  </Button>
                  <Button variant="outline-danger" onClick={() => handleDeleteItem(item.id)}>
                    <FaTrash /> Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover className="w-100">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Description</th>
                <th>Price</th>
                <th>Quantity Available</th>
                <th>Status</th>
                <th>Sold At</th>
                <th>Image</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.price}</td>
                  <td>{item.quantity_available}</td>
                  <td>{item.status}</td>
                  <td>{item.sold_at ? new Date(item.sold_at).toLocaleString() : 'N/A'}</td>
                  <td>
                    {item.image && (
                      <img src={item.image} alt="Item Image" style={{ width: "50px" }} />
                    )}
                  </td>
                  <td>
                    <Button variant="outline-info" size="sm" onClick={() => handleViewItem(item)}>
                      <FaEye />
                    </Button>
                    <Button variant="outline-primary" size="sm" onClick={() => handleUpdateItem(item)} className="ms-2">
                      <FaPen />
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => handleDeleteItem(item.id)} className="ms-2">
                      <FaTrash />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Showcase Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formItemName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={newItem.name} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formItemDescription" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" value={newItem.description} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formItemPrice" className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" name="price" value={newItem.price} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formItemQuantityAvailable" className="mb-3">
              <Form.Label>Quantity Available</Form.Label>
              <Form.Control type="number" name="quantity_available" value={newItem.quantity_available} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formItemStatus" className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control as="select" name="status" value={newItem.status} onChange={handleChange}>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="on_process">On Process</option>
                <option value="not_on_market">Not On Market</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formItemSoldAt" className="mb-3">
              <Form.Label>Sold At</Form.Label>
              <Form.Control type="datetime-local" name="sold_at" value={newItem.sold_at} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formItemImage" className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" name="image" onChange={handleImageChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddItem}><FaSave /> Save</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Showcase Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formItemName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" value={newItem.name} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formItemDescription" className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" name="description" value={newItem.description} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formItemPrice" className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" name="price" value={newItem.price} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formItemQuantityAvailable" className="mb-3">
              <Form.Label>Quantity Available</Form.Label>
              <Form.Control type="number" name="quantity_available" value={newItem.quantity_available} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formItemStatus" className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Control as="select" name="status" value={newItem.status} onChange={handleChange}>
                <option value="available">Available</option>
                <option value="sold">Sold</option>
                <option value="on_process">On Process</option>
                <option value="not_on_market">Not On Market</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formItemSoldAt" className="mb-3">
              <Form.Label>Sold At</Form.Label>
              <Form.Control type="datetime-local" name="sold_at" value={newItem.sold_at} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formItemImage" className="mb-3">
              <Form.Label>Image</Form.Label>
              <Form.Control type="file" name="image" onChange={handleImageChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleUpdateSubmit}><FaSave /> Save</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showViewModal} onHide={() => setShowViewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>View Showcase Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <div>
              <p><strong>Name:</strong> {selectedItem.name}</p>
              <p><strong>Description:</strong> {selectedItem.description}</p>
              <p><strong>Price:</strong> {selectedItem.price}</p>
              <p><strong>Quantity Available:</strong> {selectedItem.quantity_available}</p>
              <p><strong>Status:</strong> {selectedItem.status}</p>
              <p><strong>Sold At:</strong> {selectedItem.sold_at ? new Date(selectedItem.sold_at).toLocaleString() : 'N/A'}</p>
              {selectedItem.image && (
                <div>
                  <strong>Image:</strong><br />
                  <img src={selectedItem.image} alt="Item Image" style={{ width: "100%" }} />
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Showcase;
