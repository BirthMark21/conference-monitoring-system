import React from "react";
import { Link, useLocation } from "react-router-dom";

const EventAttendee = () => {
  const location = useLocation();
  const data = location.state;
  const attendees = data.event.attendees;
  const eventId = data.event.id;

  const downloadAttendee = async () => {
    try {
      // Get the event ID
      const response = await fetch(
        `http://127.0.0.1:8000/api/download-attendees-pdf/${eventId}/`,
        {
          method: "GET",
          headers: {
            Accept: "application/pdf",
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "attendees.pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Failed to download PDF");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  };

  return (
    <div>
      <table className="table caption-top rounded mt-2 bg-white">
        <caption className="text-white fs-4">Event Attendees</caption>
        <thead>
          <tr>
            <th>No.</th>
            <th>Attendee ID</th>
            <th>Full Name</th>
            <th>Phone</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {attendees.map((attendee, index) => (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{attendee.id}</td>
              <td>{attendee.fullname}</td>
              <td>{attendee.phone}</td>
              <td>{attendee.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-between">
        <Link
          className="btn btn-success fw-bold"
          to={`/events/${data.event.id}/attendees/add`}
          state={{ event: data.event }}
        >
          <i className="bi bi-plus-circle"></i> Add Attendee
        </Link>
        <a
          className="btn btn-warning"
          href={`http://127.0.0.1:8000/api/download-attendees-pdf/${eventId}/`}
        >
          Import/Download (pdf)
        </a>
      </div>
    </div>
  );
};

export default EventAttendee;
