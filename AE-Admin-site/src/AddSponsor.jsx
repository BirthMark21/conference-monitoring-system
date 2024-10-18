import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EventContext } from "./MyContext";

const AddSponsor = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { registerSponsor } = useContext(EventContext);

  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;
  const eventid = data.event.id;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sponsordata = {
      event: eventid,
      name,
      description,
    };

    const handleSuccess = (sponsor_registered) => {
      navigate(0);
    };
    const handleError = () => {
      alert("register failed");
    };

    registerSponsor(sponsordata, handleSuccess, handleError);
  };

  return (
    <div className="container text-dark" style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px" }}>
      <h2>Add Sponsor</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <input
            type="text"
            className="form-control"
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Sponsor
        </button>
      </form>
    </div>
  );
};

export default AddSponsor;
