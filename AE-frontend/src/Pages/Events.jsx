import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { EventContext } from "../MyContext";
import { FaArrowRight } from "react-icons/fa";
import indexImage from "../img/event.jpg";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const Events = () => {
  const location = useLocation();
  const successMessage = location.state?.successMessage || "";

  useEffect(() => {
    if (successMessage) {
      const alert = document.getElementById("success-alert");
      if (alert) {
        alert.style.display = "block";
        setTimeout(() => {
          alert.style.display = "none";
        }, 5000); // Hide after 5 seconds
      }
    }
  }, [successMessage]);
  const { events } = useContext(EventContext);
  console.log(events);
  const [dateFilter, setDateFilter] = useState("");

  const handleDateChange = (event) => {
    setDateFilter(event.target.value);
  };

  if (events.length === 0) {
    return (
      <div className="container">
        <section id="events">
          <div className="row mt-3 px-3">No Event Found</div>
        </section>
      </div>
    );
  }

  return (
    <section id="events">
      <div className="container">
        <div className="row mt-2 px-3">
          {successMessage && (
            <div
              id="success-alert"
              className="alert alert-success alert-dismissible fade show"
              role="alert"
            >
              {successMessage}
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
              ></button>
            </div>
          )}
          <div className="upcoming col-md-7 border p-4 fade-in">
            {/* <h3 className="fw-bold">Events</h3> */}

            {events.map((event) => (
              <div className="card mb-3 p-3" key={event.id}>
                <div className="col-md-4 col-sm-12">
                  <img
                    src={indexImage}
                    className="card-img-top my-auto"
                    alt="..."
                  />
                </div>
                <div className="col-md-8 col-sm-12">
                  <div className="card-body">
                    <h5 className="card-title">{event.title}</h5>
                    <p className="card-text text-muted">
                      Start Date: {event.start_date}
                    </p>
                    <p className="card-text text-muted">
                      Location: {event.location}
                    </p>
                    <p className="card-text">
                      <small className="text-muted">
                        Registration Start: {event.start_date}
                      </small>
                    </p>
                    <p className="card-text text-center">
                      <Link
                        to={`/events/${event.id}`}
                        state={{ event: event }}
                        className="text-primary fw-bold text-center"
                      >
                        Show Details <FaArrowRight />
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="separator-column col-md-1"></div>

          <div className="filters col-md-4 border p-4">
            <h3 className="mb-4">Filters</h3>
            <form>
              <div className="mb-3">
                <label className="form-label d-block">Date Range</label>
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="dateFilter"
                    id="all"
                    value="all"
                    onChange={handleDateChange}
                    checked={dateFilter === "all"}
                  />
                  <label className="form-check-label" htmlFor="all">
                    All
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="dateFilter"
                    id="thisYear"
                    value="thisYear"
                    onChange={handleDateChange}
                    checked={dateFilter === "thisYear"}
                  />
                  <label className="form-check-label" htmlFor="thisYear">
                    This Year
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="dateFilter"
                    id="last30Days"
                    value="last30Days"
                    onChange={handleDateChange}
                    checked={dateFilter === "last30Days"}
                  />
                  <label className="form-check-label" htmlFor="last30Days">
                    Last 30 Days
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="dateFilter"
                    id="last7Days"
                    value="last7Days"
                    onChange={handleDateChange}
                    checked={dateFilter === "last7Days"}
                  />
                  <label className="form-check-label" htmlFor="last7Days">
                    Last 7 Days
                  </label>
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Apply Filters
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events;
