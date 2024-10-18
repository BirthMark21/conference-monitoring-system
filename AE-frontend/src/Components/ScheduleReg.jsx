import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import Success from "../Pages/Success";

const ScheduleReg = () => {
  const { id } = useParams();
  console.log(id);

  const [isRegistrationSuccessful, setIsRegistrationSuccessful] =
    useState(false);
  const [validationError, setValidationError] = useState(null);

  const [date, setDate] = useState("");
  const [start_time, setStartTime] = useState("");
  const [end_time, setEndTime] = useState("");
  const [activity, setActivity] = useState("");

  const registerSchedule = async (e) => {
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
        event: id,
        date: date,
        start_time: start_time,
        end_time: end_time,
        activity: activity,
      }),
    };

    const res = await fetch(
      `http://127.0.0.1:8000api/schedule/register/`,
      requestOptions
    );
    if (res.status === 201) {
      const data = await res.json();
      console.log(data);
      setIsRegistrationSuccessful(true);
    }
  };

  const validateInputs = () => {
    // Implement your validation logic here
    // Return true if validation passes, false otherwise
    // You can check for empty fields, valid email format, etc.
    if (
      date === "" ||
      start_time === "" ||
      end_time === "" ||
      activity === ""
    ) {
      return false;
    }

    return true; // Change this logic to your actual validation
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
        <Success />
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2 mt-2">
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title text-center">
                    Schedule Registration
                  </h2>
                  <form>
                    <div className="mb-3 mt-3">
                      <div className="row">
                        <div className="mb-3">
                          <label htmlFor="date" className="form-label">
                            Date
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            id="datetime-local"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                          />
                        </div>
                        <div className="mb-3 mt-3">
                          <div className="row">
                            <div className="col-md-6">
                              <label
                                htmlFor="start_time"
                                className="form-label"
                              >
                                Start Time
                              </label>
                              <input
                                type="time"
                                className="form-control"
                                id="start_time"
                                value={start_time}
                                onChange={(e) => setStartTime(e.target.value)}
                                required
                              />
                            </div>

                            <div className="col-md-6">
                              <label htmlFor="end_time" className="form-label">
                                End Time
                              </label>
                              <input
                                type="time"
                                className="form-control"
                                id="end_time"
                                value={end_time}
                                onChange={(e) => setEndTime(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="activity" className="form-label">
                          ACTIVITY
                        </label>
                        <input
                          type="textarea"
                          className="form-control"
                          id="activity"
                          value={activity}
                          onChange={(e) => setActivity(e.target.value)}
                          required
                        />
                      </div>

                      <button
                        onClick={(e) => registerSchedule(e)}
                        className="btn btn-primary w-25"
                      >
                        Next
                      </button>
                    </div>
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

export default ScheduleReg;
