import React, { useState, useContext } from "react";
import { EventContext } from "./MyContext";

function CreateEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [regStartDate, setRegStartDate] = useState("");
  const [regEndDate, setRegEndDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [address, setAddress] = useState("");
  const [availableSeat, setAvailableSeat] = useState(0);

  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const { createEvent } = useContext(EventContext);

  const validateForm = () => {
    const newErrors = {};
    const today = new Date().toISOString().split("T")[0];

    if (!title) newErrors.title = "Title is required";
    if (!description) newErrors.description = "Description is required";
    if (!startDate) newErrors.startDate = "Start date is required";
    else if (new Date(startDate) < new Date(today)) newErrors.startDate = "Start date cannot be in the past";
    if (!endDate) newErrors.endDate = "End date is required";
    if (!regStartDate) newErrors.regStartDate = "Registration start date is required";
    if (!regEndDate) newErrors.regEndDate = "Registration end date is required";
    if (!eventLocation) newErrors.eventLocation = "Location is required";
    if (!address) newErrors.address = "Address is required";
    if (availableSeat <= 0) newErrors.availableSeat = "Available seat must be greater than 0";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setShowErrorModal(true); // Show error modal if there are validation errors
      return;
    }

    const newEventData = {
      title,
      description,
      start_date: startDate,
      end_date: endDate,
      registration_start_date: regStartDate,
      registration_end_date: regEndDate,
      location: eventLocation,
      address,
      available_seat: availableSeat,
    };

    const handleSuccess = (createdEvent) => {
      console.log("Event Created Successfully!");
      setShowSuccessModal(true);
      setTitle("");
      setDescription("");
      setStartDate("");
      setEndDate("");
      setRegStartDate("");
      setRegEndDate("");
      setEventLocation("");
      setAddress("");
      setAvailableSeat(0);
      setErrors({});
    };

    const handleError = () => {
      console.log("Event Not Created, Error");
      setShowErrorModal(true);
    };

    createEvent(newEventData, handleSuccess, handleError);
  };

  return (
    <div style={{ color: "black" }}>
      <h2>Create Event</h2>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">
                Title
              </label>
              <input
                type="text"
                className="form-control"
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              {errors.title && <div className="text-danger">{errors.title}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
              {errors.description && <div className="text-danger">{errors.description}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="start_date" className="form-label">
                Start Date
              </label>
              <input
                type="datetime-local"
                className="form-control"
                id="start_date"
                name="start_date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
              {errors.startDate && <div className="text-danger">{errors.startDate}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="end_date" className="form-label">
                End Date
              </label>
              <input
                type="datetime-local"
                className="form-control"
                id="end_date"
                name="end_date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
              {errors.endDate && <div className="text-danger">{errors.endDate}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="registration_start_date" className="form-label">
                Registration Start Date
              </label>
              <input
                type="datetime-local"
                className="form-control"
                id="registration_start_date"
                name="registration_start_date"
                value={regStartDate}
                onChange={(e) => setRegStartDate(e.target.value)}
                required
              />
              {errors.regStartDate && <div className="text-danger">{errors.regStartDate}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="registration_end_date" className="form-label">
                Registration End Date
              </label>
              <input
                type="datetime-local"
                className="form-control"
                id="registration_end_date"
                name="registration_end_date"
                value={regEndDate}
                onChange={(e) => setRegEndDate(e.target.value)}
                required
              />
              {errors.regEndDate && <div className="text-danger">{errors.regEndDate}</div>}
            </div>
          </div>
          <div className="col">
            <div className="mb-3">
              <label htmlFor="location" className="form-label">
                Location
              </label>
              <input
                type="text"
                className="form-control"
                id="location"
                name="location"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                required
              />
              {errors.eventLocation && <div className="text-danger">{errors.eventLocation}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <input
                type="text"
                className="form-control"
                id="address"
                name="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              {errors.address && <div className="text-danger">{errors.address}</div>}
            </div>
            <div className="mb-3">
              <label htmlFor="available_seat" className="form-label">
                Available Seat
              </label>
              <input
                type="number"
                className="form-control"
                id="available_seat"
                name="available_seat"
                value={availableSeat}
                onChange={(e) => setAvailableSeat(e.target.value)}
                required
              />
              {errors.availableSeat && <div className="text-danger">{errors.availableSeat}</div>}
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary mb-3"
        >
          Create Event
        </button>

        <div
          className="modal fade text-dark"
          id="successModal"
          tabIndex="-1"
          aria-labelledby="successModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-success" id="successModalLabel">
                  Success
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <h6 className="text-success fs-5">
                  Event Created Successfully!
                  <i className="bi bi-check-circle ms-3"></i>
                </h6>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  data-bs-dismiss="modal"
                  className="btn btn-primary"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          className="modal fade text-dark"
          id="errorModal"
          tabIndex="-1"
          aria-labelledby="errorModalLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger" id="errorModalLabel">
                  Error
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <h6 className="text-danger fs-5">
                  Event creation failed. Please try again.
                  <i className="bi bi-x-circle"></i>
                </h6>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  data-bs-dismiss="modal"
                  className="btn btn-primary"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateEvent;
