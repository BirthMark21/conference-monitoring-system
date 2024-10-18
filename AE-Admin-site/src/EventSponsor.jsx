import React from "react";
import { Link, useLocation } from "react-router-dom";

const EventSponsor = () => {
  const location = useLocation();
  const data = location.state;
  const sponsors = data.event.sponsors;

  return (
    <div>
      <table class="table caption-top rounded mt-2 bg-white">
        <caption className="text-white fs-4">Speakers</caption>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {sponsors.map((sponsor, index) => (
            <tr key={index}>
              <th scope="row">{sponsor.id}</th>
              <td>{sponsor.name}</td>
              <td>{sponsor.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link
        className="btn btn-success fw-bold"
        to={`/events/${data.event.id}/sponsors/add`}
        state={{ event: data.event }}
      >
        <i class="bi bi-plus-circle"></i> Add Sponsor
      </Link>
    </div>
  );
};

export default EventSponsor;
