import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EventContext } from "./MyContext";

const AddAttendee = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const { registerAttendee } = useContext(EventContext);

  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;
  const eventid = data.event.id;

  const handleAddAttendee = async (e) => {
    e.preventDefault();

    const attendeedata = {
      event: eventid,
      fullname: name,
      email: email,
      phone: phone,
    };

    const handleSuccess = (registered) => {
      navigate(0);
    };
    const handleError = () => {
      alert("register failed");
    };

    registerAttendee(attendeedata, handleSuccess, handleError);
  };

  return (
    <div className="text-white">
      <h2 className="text-center">Add Attendee</h2>
      <form onSubmit={handleAddAttendee}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            Full Name
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
        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Phone
          </label>
          <input
            type="phone"
            className="form-control"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block">
          Add
        </button>
      </form>
    </div>
  );
};

export default AddAttendee;
