import React, { useState, useContext } from "react";
import { useLocation, useParams } from "react-router-dom";
import Success from "./Success";
import { EventContext } from "../MyContext";
import { useNavigate } from "react-router-dom";

const Register = ({
  FullName,
  Email,
  eventId,
  onRegistrationSuccess,
  AvailableSeat,
  Attendee,
}) => {
  const [availableSeat, setAvailableSeat] = useState(true);

  if (AvailableSeat <= Attendee) {
    setAvailableSeat(false);
  }

  const [validationError, setValidationError] = useState(null);
  const [isRegistrationSuccessful, setIsRegistrationSuccessful] =
    useState(true);

  const [phone, setPhone] = useState("");

  const location = useLocation();
  const data = location.state;
  console.log(data);

  const navigate = useNavigate();

  const registerAttendee = async (e) => {
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
        event: eventId,
        fullname: FullName,
        email: Email,
        phone: phone,
      }),
    };

    const res = await fetch(
      "http://127.0.0.1:8000/api/attendee/register/",
      requestOptions
    );
    if (res.status === 201) {
      const resData = await res.json();
      console.log(resData);
      setIsRegistrationSuccessful(true);
      onRegistrationSuccess();
    }
  };

  const validateInputs = () => {
    // Implement your validation logic here
    // Return true if validation passes, false otherwise
    // You can check for empty fields, valid email format, etc.
    if (phone === "") {
      return false;
    }

    return true; // Change this logic to your actual validation
  };

  return (
    <>
      {availableSeat ? (
        <section id="register">
          {validationError && (
            <div
              className="alert alert-danger alert-dismissible fade show"
              role="alert"
            >
              {validationError}
            </div>
          )}
          <div className="container min-vh-100">
            <div className="row">
              <div className="col-lg-4 offset-lg-4 mt-2">
                <div className="card">
                  <div className="card-body">
                    <h2 className="card-title text-center">Register</h2>
                    <form onSubmit={registerAttendee}>
                      <div className="mb-3 col-8 mx-auto">
                        <label htmlFor="phoneNumber" className="form-label">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          className="form-control"
                          id="phoneNumber"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>

                      <button type="submit" className="btn btn-primary w-80">
                        Register
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section id="register">
          <div className="container min-vh-100">
            <div className="row">
              <div className="col-lg-8 offset-lg-2 mt-2">
                <div className="card">
                  <div className="card-body">
                    <h2 className="card-title text-center">
                      Sorry! Room is Full
                    </h2>
                    <p className="text-center">See you next time </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default Register;
