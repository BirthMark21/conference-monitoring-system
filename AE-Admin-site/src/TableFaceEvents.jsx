// TableFaceEvents.jsx
import React, { useContext } from "react";
import { Table, Button } from "react-bootstrap";
import { FaceContext } from "./FaceContext";
import UpdateFaceEvents from "./UpdateFaceEvents";

const TableFaceEvents = () => {
  const { filteredEvents, setViewMode, handleDelete } = useContext(FaceContext);

  return (
    <div className="container">
      <h1>Event List</h1>
      <Button onClick={() => setViewMode("details")}>Switch to Card View</Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Description</th>
            <th>Date</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredEvents.map((event) => (
            <tr key={event.id}>
              <td>{event.name}</td>
              <td>{event.description}</td>
              <td>{new Date(event.date).toLocaleString()}</td>
              <td>{event.location}</td>
              <td>
                <UpdateFaceEvents event={event} />
                <Button
                  variant="danger"
                  className="ml-2"
                  onClick={() => handleDelete(event.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TableFaceEvents;
