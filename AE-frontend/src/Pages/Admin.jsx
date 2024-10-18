import React, { useContext } from "react";
import { EventContext } from "../MyContext";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import imageUrl from "../img/event.jpg";

const Admin = () => {
  const { events } = useContext(EventContext);
  const allevents = events.sort((a, b) => a.id - b.id);

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
    <>
      <section id="events">
        <div className="container">
          <div className="card mt-3 mb-3 p-3">
            <div className="card-body d-flex justify-content-between  align-items-center">
              <p className="m-0">Admin </p>
              <Link
                to={"/eventreg"}
                className="text-white  link-underline-opacity-0"
              >
                <button type="button" className="btn btn-primary min-w-25">
                  Add Event +
                </button>
              </Link>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row row-cols-3 mt-2 px-3">
            {events.map((event) => (
              <div className="col-lg-4  col-12 mb-4">
                <div className="card mb-3 p-3 d-flex">
                  <div className="row">
                    <div className="col-md-4 col-lg-12">
                      <img src={imageUrl} className="card-img-top" alt="..." />
                    </div>

                    <div className="col-md-8 col-lg-12">
                      <div className="card-body">
                        <h5 className="card-title mt-2">{event.title}</h5>
                        <p className="card-text text-muted">
                          Start Date: {event.start_date}
                        </p>
                        <div className="d-flex justify-content-between align-items-center">
                          <Link
                            to={`/speaker/${event.id}`}
                            className="text-white "
                          >
                            <button className="btn btn-outline-primary btn-block">
                              Add Details
                            </button>
                          </Link>
                          <p className="text-danger m-0">Delete</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Admin;
