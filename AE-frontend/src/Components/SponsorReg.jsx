import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import ScheduleReg from "../Components/ScheduleReg";

const SponsorReg = () => {
  const { id } = useParams();
  console.log(id);

  const [isRegistrationSuccessful, setIsRegistrationSuccessful] =
    useState(false);
  const [validationError, setValidationError] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const registerSponsor = async (e) => {
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
        name: name,
        description: description,
      }),
    };

    const res = await fetch(
      `http://127.0.0.1:8000api/sponsor/register/`,
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
    if (name === "" || description === "") {
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
        <ScheduleReg />
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2 mt-2">
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title text-center">
                    Sponsor Registration
                  </h2>
                  <form>
                    <div className="mb-3 mt-3">
                      <div className="row">
                        <div className="col-md-6">
                          <label htmlFor="name" className="form-label">
                            Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="description" className="form-label">
                            Description
                          </label>
                          <input
                            type="description"
                            className="form-control"
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => registerSponsor(e)}
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

export default SponsorReg;
