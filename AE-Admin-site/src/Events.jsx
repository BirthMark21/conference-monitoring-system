import React, { useState, useContext } from "react";
import { EventContext } from "./MyContext";
import { Link } from "react-router-dom";

function Events() {
  const { events } = useContext(EventContext);

  if (events.length === 0) {
    return <div className="text-white">No Event Found</div>;
  }

  return (
    <div>
      <table className="table caption-top rounded mt-2 bg-white">
        <caption className="text-dark fs-4">All Events</caption>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Date</th>
            <th>Location</th>
            <th>Status</th>
            <th>Alter Event</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td>{event.id}</td>
              <td>{event.title}</td>
              <td>{event.start_date}</td>
              <td>{event.location}</td>
              <td>{event.status}</td>

              <td>
                <Link
                  to={`/events/${event.id}`}
                  state={{ event: event }}
                  className="btn btn-primary btn-sm fw-bold"
                >
                  <i className="bi bi-eye"></i> SHOW
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <a href="/events/create" className="btn btn-success fw-bold mb-3">
        <i className="bi bi-plus-circle"></i> Create New Event
      </a>
    </div>
  );
}

export default Events;
