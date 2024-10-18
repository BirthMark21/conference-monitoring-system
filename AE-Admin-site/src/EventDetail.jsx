import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { EventContext } from "./MyContext";

const EventDetail = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { deleteEvent } = useContext(EventContext);

  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;
  console.log(data);
  const path = data.event.id;

  const showDeleteConfirmation = () => {
    setShowDeleteModal(true);
  };

  const handleEmail = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/send_mails");
    if (!res.ok) {
      throw new Error("Failed to send email");
    } else {
      console.log("Email sent successfully");
    }
    return res.json();
  };

  const hideDeleteConfirmation = () => {
    setShowDeleteModal(false);
  };

  const confirmDelete = async () => {
    if (data?.event) {
      const eventId = data.event.id; // Assuming the event object has an "id" property

      await deleteEvent(
        eventId,
        () => {
          console.log("Event deleted successfully");
          // Handle success, e.g., navigate to a different page or show a success message
          navigate("/events");
        },
        () => {
          console.error("Failed to delete event");
          // Handle the error, e.g., show an error message
        }
      );
      hideDeleteConfirmation();
    }
  };

  return (
    <div className="container">
      <h1 className="display-4 mb-4">Event Details</h1>

      {data ? (
        <div>
          <h2 className="mb-3">{data.event.title}</h2>
          <p className="lead">{data.event.description}</p>
          <div className="row">
            <div className="col-md-6">
              <Link
                to={`/sharelink/${data.event.id}`}
                state={{ data: data.event }}
                className="btn btn-danger mb-3"
              >
                Go Live
              </Link>
              <ul className="list-group mb-4">
                <li className="list-group-item">
                  <strong>Location:</strong> {data.event.location}
                </li>
                <li className="list-group-item">
                  <strong>Address:</strong> {data.event.address}
                </li>
                <li className="list-group-item">
                  <strong>Start Date:</strong> {data.event.start_date}
                </li>
                <li className="list-group-item">
                  <strong>End Date:</strong> {data.event.end_date}
                </li>
                <li className="list-group-item">
                  <strong>Registration Start Date:</strong>{" "}
                  {data.event.registration_start_date}
                </li>
                <li className="list-group-item">
                  <strong>Registration End Date:</strong>{" "}
                  {data.event.registration_end_date}
                </li>
                <li className="list-group-item">
                  <strong>Available Seats:</strong> {data.event.available_seat}
                </li>
                <li className="list-group-item">
                  <strong>Event Status:</strong> {data.event.status}
                </li>
                <li className="list-group-item">
                  <button className="btn btn-primary" onClick={handleEmail}>
                    Send Email
                  </button>
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <ul className="list-group">
                <li className="list-group-item">
                  <Link
                    to={`/events/${data.event.id}/speakers`}
                    state={{ event: data.event }}
                  >
                    <i className="bi bi-megaphone me-1"></i>Speakers
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link
                    to={`/events/${data.event.id}/sponsors`}
                    state={{ event: data.event }}
                  >
                    <i className="bi bi-globe me-1"></i>Sponsors
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link
                    to={`/events/${data.event.id}/attendees`}
                    state={{ event: data.event }}
                  >
                    View Event Attendees
                  </Link>
                </li>
                <li className="list-group-item">
                  <Link
                    to={`/events/${data.event.id}/schedules`}
                    state={{ event: data.event }}
                  >
                    View Event Schedule
                  </Link>
                </li>
              </ul>
              {data.event.status === "passed" && (
                <a
                  className="btn btn-warning float-md-end mt-3"
                  href={`http://127.0.0.1:8000api/download-event-report-pdf/${data.event.id}/`}
                >
                  Generate Event Report (pdf)
                </a>
              )}
            </div>
          </div>

          <div className="row mb-3 mt-3 mt-sm-0">
            <div className="col-12 col-md d-flex flex-column flex-md-row justify-content-between">
              <div className="col-md-3">
                <Link
                  className="btn btn-primary btn-outline btn-sm w-100 w-md-25 fw-bold mb-2 mb-md-0"
                  to={`/events/${data.event.id}/update`}
                  state={{ event: data.event }}
                >
                  <i className="bi bi-pencil-square"></i> Edit
                </Link>
              </div>
              <div className="col-md-3">
                <button
                  className="btn btn-danger btn-outline btn-sm w-100 w-md-25 fw-bold"
                  onClick={showDeleteConfirmation}
                >
                  <i className="bi bi-trash3-fill"></i> Delete This Event
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading event details...</p>
      )}
      <div
        className={`modal text-dark ${showDeleteModal ? "show" : ""}`}
        style={{
          display: showDeleteModal ? "block" : "none",
        }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirmation</h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={hideDeleteConfirmation}
              ></button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete this event?</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={hideDeleteConfirmation}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`modal-backdrop fade ${showDeleteModal ? "show" : ""}`}
        style={{
          display: showDeleteModal ? "block" : "none",
        }}
      ></div>
    </div>
  );
};

export default EventDetail;
