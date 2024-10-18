import React, { useState, useContext, useEffect } from "react";
import { EventContext } from "./MyContext";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";

function UpdateEvent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [regStartDate, setRegStartDate] = useState("");
  const [regEndDate, setRegEndDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [address, setAddress] = useState("");
  const [availableSeat, setAvailableSeat] = useState(0);

  const location = useLocation();
  const data = location.state;

  useEffect(() => {
    if (data) {
      // If eventToEdit is provided, we are in edit mode, so populate the form fields
      setTitle(data.event.title);
      setDescription(data.event.description);
      setStartDate(
        format(new Date(data.event.start_date), "yyyy-MM-dd'T'HH:mm")
      );
      setEndDate(format(new Date(data.event.end_date), "yyyy-MM-dd'T'HH:mm"));

      setRegStartDate(
        format(
          new Date(data.event.registration_start_date),
          "yyyy-MM-dd'T'HH:mm"
        )
      );
      setRegEndDate(
        format(new Date(data.event.registration_end_date), "yyyy-MM-dd'T'HH:mm")
      );
      setEventLocation(data.event.location);
      setAddress(data.event.address);
      setAvailableSeat(data.event.available_seat);
    }
  }, [data]);

  const { editEvent } = useContext(EventContext);

  const [showSuccessModal, setShowSuccessModal] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a new event object with the form data
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

    const handleSuccess = (updatedEvent) => {
      // Handle success (e.g., update the UI, reset the form)
      console.log("Event Updated Successfully!");
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
    };

    const handleError = () => {
      // Handle error (e.g., show an error message)
      console.log("Event Update Error");
      setShowSuccessModal(false);
    };

    editEvent(data.event.id, newEventData, handleSuccess, handleError);
  };

  return (
    <div className="text-white">
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
              />
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
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary mb-3"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Update Event
        </button>

        <div
          class="modal fade text-dark"
          id="exampleModal"
          tabindex="-1"
          aria-labelledby="exampleModalLabel"
          aria-hidden="true"
        >
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                {showSuccessModal ? (
                  <h5 class="modal-title text-success" id="exampleModalLabel">
                    Success
                  </h5>
                ) : (
                  <h5 class="modal-title text-danger" id="exampleModalLabel">
                    fail
                  </h5>
                )}

                <button
                  type="button"
                  class="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div class="modal-body">
                {showSuccessModal ? (
                  <h6 className="text-success fs-5">
                    Event Updated Successfully!
                    <i class="bi bi-check-circle ms-3"></i>
                  </h6>
                ) : (
                  <h6 className="text-danger fs-5">
                    Event Update failed. Please try again.
                    <i class="bi bi-x-circle"></i>
                  </h6>
                )}
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  data-bs-dismiss="modal"
                  class="btn btn-primary"
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

export default UpdateEvent;
