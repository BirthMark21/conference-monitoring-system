import React, { useContext } from "react";
import AdminHeader from "./AdminHeader";
// import Events1 from "../Events";
import { EventContext } from "../../MyContext";
import EventList from "./EventList";
import SearchBar from "./SearchBar";
import { useLocation } from "react-router-dom";

const CountCard = () => {
  const { events } = useContext(EventContext);
  const { speakers } = useContext(EventContext);
  const { sponsors } = useContext(EventContext);
  const { attendees } = useContext(EventContext);
  const location = useLocation();
  const data = location.state;
  console.log(data);
  console.log(events);
  const countEvents = events.length;
  const countSpeakers = speakers.length;
  const countSponsors = sponsors.length;
  const countAttendees = attendees.length;

  return (
    <section id="events">
      <div className="container mt-5" id="headerAdmin">
        <div className="row">
          <div className="col-md-3">
            <div className="card border-start mt-1 p-3 d-flex flex-column">
              <div
                className="decore bg-primary position-absolute top-0 start-0 h-100 rounded-start"
                style={{ width: "6px" }}
              ></div>
              <div className="card-body ps-2">
                <h5 className="card-title text-muted mb-0  me-4">Events</h5>
                <h1 className="mb-0 mt-4">
                  {countEvents}
                  <span className="fs-3">+</span>
                </h1>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-start mt-1 p-3 d-flex flex-column">
              <div
                className="decore bg-primary position-absolute top-0 start-0 h-100 rounded-start"
                style={{ width: "6px" }}
              ></div>
              <div className="card-body ps-2">
                <h5 className="card-title text-muted mb-0  me-4">Speakers</h5>
                <h1 className="mb-0 mt-4">
                  {countSpeakers}
                  <span className="fs-3">+</span>
                </h1>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-start mt-1 p-3 d-flex flex-column">
              <div
                className="decore bg-primary position-absolute top-0 start-0 h-100 rounded-start"
                style={{ width: "6px" }}
              ></div>
              <div className="card-body ps-2">
                <h5 className="card-title text-muted mb-0  me-4">Sponsors</h5>
                <h1 className="mb-0 mt-4">
                  {countSponsors}
                  <span className="fs-3">+</span>
                </h1>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-start mt-1 p-3 d-flex flex-column">
              <div
                className="decore bg-primary position-absolute top-0 start-0 h-100 rounded-start"
                style={{ width: "6px" }}
              ></div>
              <div className="card-body ps-2">
                <h5 className="card-title text-muted mb-0  me-4">Attendees</h5>
                <h1 className="mb-0 mt-4">
                  {countAttendees}
                  <span className="fs-3">+</span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdminHeader />

      <EventList />
    </section>
  );
};

export default CountCard;
