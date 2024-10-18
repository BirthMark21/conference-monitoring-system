import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import EventSuccess from "./EventSuccess";

const EventReg = () => {
  const [isRegistrationSuccessful, setIsRegistrationSuccessful] =
    useState(false);
  const [validationError, setValidationError] = useState(null);
  const [currentpath, setCurrentPath] = useState(null);
  const [eventData, setEventdata] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [address, setAddress] = useState("");
  const [available_seat, setAvailableSeat] = useState("");
  const [start_date, setStartDate] = useState("");
  const [end_date, setEndDate] = useState("");
  const [reg_start_date, setRegStartDate] = useState("");
  const [reg_end_date, setRegEndDate] = useState("");

  const registerEvent = async (e) => {
    e.preventDefault();

    // Perform frontend validation
    if (!validateInputs()) {
      setValidationError("Please fill out all required fields.");
      return;
    }

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title,
        location: location,
        description: description,
        address: address,
        available_seat: available_seat,
        start_date: start_date,
        end_date: end_date,
        registration_start_date: reg_start_date,
        registration_end_date: reg_end_date,
      }),
    };

    const res = await fetch(
      `http://127.0.0.1:8000/api/event/register/`,
      requestOptions
    );
    if (res.status === 201) {
      const data = await res.json();
      console.log(data);
      setEventdata(data);
      console.log(data.id);
      setCurrentPath(data.id);
      setIsRegistrationSuccessful(true);
    } else {
      setValidationError("the connection is not established");
    }
  };

  const validateInputs = () => {
    if (
      title.trim() === "" ||
      description.trim() === "" ||
      location.trim() === "" ||
      address.trim() === "" ||
      available_seat.trim() === "" ||
      end_date.trim() === "" ||
      reg_start_date.trim() === "" ||
      reg_end_date.trim() === ""
    ) {
      return false;
    }

    return true;
  };

  return (
    <section id="register">
      {validationError && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {validationError}
        </div>
      )}

      {isRegistrationSuccessful ? (
        <EventSuccess current={currentpath} />
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2 mt-2">
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title text-center">Event Registration</h2>
                  <form>
                    <div className="mb-3 mt-3">
                      <div className="row">
                        <div className="mb-3">
                          <label htmlFor="title" className="form-label">
                            Title
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                          />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="discription" className="form-label">
                            Description
                          </label>
                          <textarea
                            className="form-control"
                            id="discription"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                          ></textarea>
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="location" className="form-label">
                        Location
                      </label>
                      <input
                        type="location"
                        className="form-control"
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="address" className="form-label">
                        Address
                      </label>
                      <input
                        type="address"
                        className="form-control"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>
                    <div className="mb-3 mt-3">
                      <div className="row">
                        <div className="col-md-6">
                          <label htmlFor="start_date" className="form-label">
                            Start Date and Time
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            id="start_date"
                            value={start_date}
                            onChange={(e) => setStartDate(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="end_date" className="form-label">
                            End Date and Time
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            id="end_date"
                            value={end_date}
                            onChange={(e) => setEndDate(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-3 mt-3">
                      <div className="row">
                        <div className="col-md-6">
                          <label htmlFor="reg_start" className="form-label">
                            Registration Start Date
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            id="reg_start"
                            value={reg_start_date}
                            onChange={(e) => setRegStartDate(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="reg_end" className="form-label">
                            Registration End Date
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            id="reg_end"
                            value={reg_end_date}
                            onChange={(e) => setRegEndDate(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="available_seat" className="form-label">
                        Available Seat
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        id="available_seat"
                        value={available_seat}
                        onChange={(e) => setAvailableSeat(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      onClick={(e) => registerEvent(e)}
                      className="btn btn-primary w-25"
                    >
                      Next
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default EventReg;
