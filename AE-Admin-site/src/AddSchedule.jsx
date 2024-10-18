import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EventContext } from "./MyContext";

const AddSchedule = () => {
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [title, setTitle] = useState("");
  const [activity, setActivity] = useState("");
  const [description, setDescription] = useState("");
  const [moderator, setModerator] = useState("");
  const [location, setLocation] = useState("");
  const [format, setFormat] = useState("");
  const [objectives, setObjectives] = useState("");
  const [notes, setNotes] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { registerSchedule } = useContext(EventContext);
  const currentLocation = useLocation();
  const navigate = useNavigate();
  
  // Validate location state
  const data = currentLocation.state;
  const eventid = data && data.event ? data.event.id : null;

  useEffect(() => {
    if (!eventid) {
      console.error('Event data is missing or invalid');
      navigate('/'); // Redirect to a safe page or show an error message
    }
  }, [eventid, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const scheduleData = {
      event: eventid,
      date,
      start_time: startTime,
      end_time: endTime,
      title,
      activity,
      description,
      moderator,
      location,
      format,
      objectives,
      notes,
    };

    const handleSuccess = (schedule_registered) => {
      setSuccessMessage("Schedule successfully added!");
      setTimeout(() => setSuccessMessage(""), 3000); // Clear message after 3 seconds
      navigate(0); // Reload the page or update the list
    };

    const handleError = () => {
      alert("Registration failed");
    };

    registerSchedule(scheduleData, handleSuccess, handleError);
  };

  return (
    <div className="container text-dark">
      <h2 className="text-dark">Add Schedule</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col">
            <div className="mb-3">
              <label htmlFor="date" className="form-label text-dark">
                Date
              </label>
              <input
                type="date"
                className="form-control border border-dark"
                id="date"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                style={{ color: "black" }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="start_time" className="form-label text-dark">
                Start Time
              </label>
              <input
                type="time"
                className="form-control border border-dark"
                id="start_time"
                name="start_time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                style={{ color: "black" }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="end_time" className="form-label text-dark">
                End Time
              </label>
              <input
                type="time"
                className="form-control border border-dark"
                id="end_time"
                name="end_time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                style={{ color: "black" }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="title" className="form-label text-dark">
                Title
              </label>
              <input
                type="text"
                className="form-control border border-dark"
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{ color: "black" }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="activity" className="form-label text-dark">
                Activity
              </label>
              <textarea
                className="form-control border border-dark"
                id="activity"
                name="activity"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                required
                style={{ color: "black" }}
              ></textarea>
            </div>
          </div>
          <div className="col">
            <div className="mb-3">
              <label htmlFor="description" className="form-label text-dark">
                Description
              </label>
              <textarea
                className="form-control border border-dark"
                id="description"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ color: "black" }}
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="moderator" className="form-label text-dark">
                Moderator
              </label>
              <input
                type="text"
                className="form-control border border-dark"
                id="moderator"
                name="moderator"
                value={moderator}
                onChange={(e) => setModerator(e.target.value)}
                style={{ color: "black" }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="location" className="form-label text-dark">
                Location
              </label>
              <input
                type="text"
                className="form-control border border-dark"
                id="location"
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ color: "black" }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="format" className="form-label text-dark">
                Format
              </label>
              <input
                type="text"
                className="form-control border border-dark"
                id="format"
                name="format"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                style={{ color: "black" }}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="objectives" className="form-label text-dark">
                Objectives
              </label>
              <textarea
                className="form-control border border-dark"
                id="objectives"
                name="objectives"
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                style={{ color: "black" }}
              ></textarea>
            </div>
            <div className="mb-3">
              <label htmlFor="notes" className="form-label text-dark">
                Notes
              </label>
              <textarea
                className="form-control border border-dark"
                id="notes"
                name="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{ color: "black" }}
              ></textarea>
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-primary">
          Add Schedule
        </button>
      </form>

      {successMessage && (
        <div className="alert alert-success mt-3" role="alert">
          {successMessage}
        </div>
      )}
    </div>
  );
};

export default AddSchedule;
