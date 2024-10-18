import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { EventContext } from "../MyContext";
import indexImage from "../img/index.webp";
import Navbar from "../Components/Navbar";

const Home = () => {
  const { events } = useContext(EventContext);
  const { records } = useContext(EventContext);

  const latestThree = events.slice(-3);

  const upcomingevents = events.filter((event) => event.status === "upcoming");

  const firstSixEvents = upcomingevents.slice(0, Math.min(events.length, 6));
  console.log(firstSixEvents);

  const mostRecentEvent =
    firstSixEvents.length > 0
      ? firstSixEvents[firstSixEvents.length - 1]
      : null;

  return (
    <>
      <Navbar />
      <section
        id="hero"
        className="min-vh-100 d-flex align-items-start text-center fade-in"
      >
        <div className="container">
          <div className="row">
            <span className="text-warning fw-bold b-2 bounceDown">
              Upcoming
            </span>
            <div className="col-12">
              <h1 className="text-capitalize mt-5 text-white fw-semibold display-6 fade-in">
                {mostRecentEvent ? mostRecentEvent.title : ""}
              </h1>
              <h5 className="text-white mt-3 mb-3 fade-in">
                {mostRecentEvent
                  ? `${mostRecentEvent.start_date} - ${mostRecentEvent.address}, ${mostRecentEvent.location}`
                  : ""}
              </h5>
              {mostRecentEvent && (
                <div className="mt-4">
                  <Link
                    to={`/events/${mostRecentEvent.id}`}
                    state={{ event: mostRecentEvent }}
                    className="btn btn-info me-2 slide-from-left"
                  >
                    View Schedule
                  </Link>
                  {/* <Link
                    to={`/register/${mostRecentEvent.id}`}
                    className="btn btn-light ms-2 slide-from-right"
                  >
                    Register Now
                  </Link> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>


      <section
        id="upcoming-events"
        className="py-5"
        style={{ backgroundColor: "#F8F9FA" }}
      >
        <div className="container">
          <h2 className="text-center mb-4 section-title">Latest Events</h2>
          <div className="row">
            {latestThree.map((event, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card custom-event-card">
                  <img
                    src={indexImage}
                    className="card-img-top"
                    alt="Event 1"
                  />
                  <div className="card-body">
                    <h5 className="card-title text-muted">{event.title}</h5>
                    <p className="card-text">
                      <span className="text-muted">Date: </span>
                      <b>November 5, 2023</b>
                    </p>
                    <p className="card-text">
                      <span className="text-muted">Location:</span>{" "}
                      <b>{event.location}</b>
                    </p>
                    <Link
                      to={`/events/${event.id}`}
                      state={{ event: event }}
                      className="btn btn-outline-primary btn-block"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            {/* Add more upcoming event cards here */}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
