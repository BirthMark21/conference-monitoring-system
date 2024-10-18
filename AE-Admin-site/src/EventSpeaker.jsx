import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { EventContext } from "./MyContext";

const EventSpeaker = () => {
  const [fullname, setFullname] = useState("");
  const [organization, setOrganization] = useState("");
  const [role, setRole] = useState("");
  const { registerSpeaker } = useContext(EventContext);
  const { speakers } = useContext(EventContext);
  const [selectedSpeakerId, setSelectedSpeakerId] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const location = useLocation();
  const data = location.state;
  const eventSpeakers = data.event.speakers;
  const eventId = data.event.id;

  const navigate = useNavigate();

  const handleSelectChange = (e) => {
    setSelectedSpeakerId(e.target.value);
  };

  const selectedSpeakerIdNumber = parseInt(selectedSpeakerId, 10);
  const selectedSpeaker = speakers.find(
    (speaker) => speaker.id === selectedSpeakerIdNumber
  );

  const handleSelectSubmit = async (e) => {
    e.preventDefault();

    const speakerData = {
      event: eventId,
      fullname: selectedSpeaker.fullname,
      organization: selectedSpeaker.organization,
      role: selectedSpeaker.role,
    };

    const handleSuccess = (speaker_registered) => {
      setSuccessMessage("Speaker successfully assigned to this event!");
      setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds
      navigate("/events");
    };
    const handleError = () => {
      alert("Registration failed");
    };

    registerSpeaker(speakerData, handleSuccess, handleError);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const speakerData = {
      event: eventId,
      fullname,
      organization,
      role,
    };

    const handleSuccess = (speaker_registered) => {
      setFullname("");
      setOrganization("");
      setRole("");
      setSuccessMessage("Speaker successfully added to this event!");
      setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds
      navigate("/events");
    };
    const handleError = () => {
      alert("Registration failed");
    };

    registerSpeaker(speakerData, handleSuccess, handleError);
  };

  return (
    <div>
      <table className="table caption-top rounded mt-2 bg-white">
        <caption className="text-black fs-4">Speakers</caption>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Organization</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {eventSpeakers?.map((speaker) => (
            <tr key={speaker.id}>
              <th scope="row">{speaker.id}</th>
              <td>{speaker.fullname}</td>
              <td>{speaker.organization}</td>
              <td>{speaker.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        type="button"
        className="btn btn-success fw-bold"
        data-bs-toggle="modal"
        data-bs-target="#exampleModalToggle"
      >
        <i className="bi bi-plus-circle" /> Add Speaker
      </button>
      <div
        className="modal fade"
        id="exampleModalToggle"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalToggleLabel">
                Add Speaker
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <select
                className="form-select"
                aria-label="Default select example"
                value={selectedSpeakerId}
                onChange={handleSelectChange}
              >
                <option value="" disabled>
                  Choose Speaker
                </option>
                {speakers.map((speaker, index) => (
                  <option key={index} value={speaker.id}>
                    {speaker.fullname}
                  </option>
                ))}
              </select>
            </div>
            <div className="modal-footer d-flex justify-content-between">
              <button
                className="btn btn-success"
                data-bs-target="#exampleModalToggle2"
                data-bs-toggle="modal"
              >
                <i className="bi bi-plus-circle" /> Add New
              </button>
              <button
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleSelectSubmit}
              >
                Add Speaker
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal fade"
        id="exampleModalToggle2"
        aria-hidden="true"
        aria-labelledby="exampleModalToggleLabel2"
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalToggleLabel2">
                Add New Speaker
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="container">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="fullname" className="form-label text-black">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="form-control border border-dark"
                      id="fullname"
                      name="fullname"
                      value={fullname}
                      onChange={(e) => setFullname(e.target.value)}
                      required
                      style={{ color: "black" }}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="organization" className="form-label text-black">
                      Organization
                    </label>
                    <input
                      type="text"
                      className="form-control border border-dark"
                      id="organization"
                      name="organization"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      required
                      style={{ color: "black" }}
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label text-black">
                      Role
                    </label>
                    <input
                      type="text"
                      className="form-control border border-dark"
                      id="role"
                      name="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                      style={{ color: "black" }}
                    />
                  </div>
                  <div className="modal-footer d-flex justify-content-between">
                    <button
                      className="btn btn-secondary"
                      data-bs-target="#exampleModalToggle"
                      data-bs-toggle="modal"
                    >
                      Back
                    </button>
                    <button
                      className="btn btn-primary"
                      data-bs-dismiss="modal"
                      onClick={(e) => {
                        e.preventDefault();
                        handleSubmit();
                      }}
                    >
                      Add Speaker
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="alert alert-success mt-3" role="alert">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default EventSpeaker;
