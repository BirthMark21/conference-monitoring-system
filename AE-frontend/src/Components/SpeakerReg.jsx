import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import SponsorReg from "./SponsorReg";

const SpeakerReg = () => {
  const { id } = useParams();
  console.log(id);

  const [isRegistrationSuccessful, setIsRegistrationSuccessful] =
    useState(false);
  const [validationError, setValidationError] = useState(null);

  const [name, setName] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");

  const registerSpeaker = async (e) => {
    e.preventDefault();

    // Perform frontend validation
    if (!validateInputs()) {
      setValidationError("Please fill out all required fields.");
      return;
    }

    const res = await fetch("http://127.0.0.1:8000api/speaker/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: id,
        fullname: name,
        organization: organization,
        role: role,
      }),
    });
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
    if (name === "" || organization === "" || role === "") {
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
        <SponsorReg />
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2 mt-2">
              <div className="card">
                <div className="card-body">
                  <h2 className="card-title text-center">
                    Speaker Registration
                  </h2>
                  <form>
                    <div className="mb-3 mt-3">
                      <div className="row">
                        <div className="col-md-6">
                          <label htmlFor="fullName" className="form-label">
                            Full Name
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="fullName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="organization" className="form-label">
                            organization
                          </label>
                          <input
                            type="organization"
                            className="form-control"
                            id="organization"
                            value={organization}
                            onChange={(e) => setOrganization(e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="role" className="form-label">
                        Role
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                      />
                    </div>

                    <button
                      onClick={(e) => registerSpeaker(e)}
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

export default SpeakerReg;
