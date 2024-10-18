import React from "react";
import { Link, useLocation } from "react-router-dom";

const EventSchedule = () => {
  const { state } = useLocation();
  const { event } = state || {};
  const schedules = event?.schedules || [];

  return (
    <div>
      <div style={{ overflowX: 'auto', marginTop: '10px' }}>
        <table 
          className="table caption-top rounded bg-white"
          style={{ minWidth: '1500px', whiteSpace: 'nowrap' }}
        >
          <caption className="text-dark fs-4">Schedules</caption>
          <thead>
            <tr>
              <th>ID</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Title</th>
              <th>Activity</th>
              <th>Description</th>
              <th>Moderator</th>
              <th>Location</th>
              <th>Format</th>
              <th>Objectives</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.id}>
                <th scope="row">{schedule.id}</th>
                <td>{schedule.date}</td>
                <td>{schedule.start_time}</td>
                <td>{schedule.end_time}</td>
                <td>{schedule.title}</td>
                <td>{schedule.activity}</td>
                <td>{schedule.description}</td>
                <td>{schedule.moderator}</td>
                <td>{schedule.location}</td>
                <td>{schedule.format}</td>
                <td>{schedule.objectives}</td>
                <td>{schedule.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ textAlign: 'right', marginTop: '10px' }}>
        <Link
          className="btn btn-success fw-bold"
          to={`/events/${event?.id}/schedules/add`}
          state={{ event }}
          style={{ display: 'inline-block' }}
        >
          <i className="bi bi-plus-circle"></i> Add Schedule
        </Link>
      </div>
    </div>
  );
};

export default EventSchedule;
