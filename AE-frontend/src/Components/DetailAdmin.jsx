import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import BackImg from "../Components/BackImg";
import imageUrl from "../img/back_banner.webp";
import duresaImage from "../img/duresa.jpg";

const DetailAdmin = () => {
  const imageUrl = "/images/back_banner.webp";

  const location = useLocation();
  console.log(location);
  const data = location.state;
  console.log(data);
  console.log(data.event.title);
  const targetDate = new Date(data.event.start_date);

  const options = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  return (
    <>
      <section id="event-detail">
        <BackImg imageUrl={imageUrl} className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h1 className="text-capitalize mt-5 text-white fw-semiblod display-6">
                {data.event.title}
              </h1>
              <h5 className="text-white mt-3 mb-3">
                {targetDate.toLocaleString("en-US", options)} -{" "}
                {data.event.address}, {data.event.location}
              </h5>
            </div>
          </div>
        </BackImg>
      </section>

      <section id="event-detail">
        <div className="container">
          <div className="row row-2">
            <div className="col-md-6  mb-5">
              <div className="card mb-2 p-4">
                <h3 className="card-title text-capitalize">Speakers</h3>
                <div className="card-body p-0">
                  <div className="row">
                    <div className="col-12 mx-auto">
                      <div className="card mt-2">
                        <div className="card-body d-flex align-items-center justify-content-start">
                          <div
                            className="card-img me-4"
                            style={{ width: "fit-content" }}
                          >
                            <img
                              src={duresaImage}
                              style={{
                                width: "75px",
                                height: "75px",
                                borderRadius: "100%",
                              }}
                            />
                          </div>
                          <div className="speaker-title ">
                            <h5 className="">Chapi menge</h5>
                            <p className="text-muted mb-0">organizer</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <button className="btn btn-primary w-25 mt-4">Add</button>

                <div
                  className="modal fade"
                  id="exampleModal"
                  tabindex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">
                          New message
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="modal-body">
                        <form>
                          <div className="mb-3">
                            <label
                              for="recipient-name"
                              className="col-form-label"
                            >
                              Recipient:
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              id="recipient-name"
                            />
                          </div>
                          <div className="mb-3">
                            <label
                              for="message-text"
                              className="col-form-label"
                            >
                              Message:
                            </label>
                            <textarea
                              className="form-control"
                              id="message-text"
                            ></textarea>
                          </div>
                        </form>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                        <button type="button" className="btn btn-primary">
                          Send message
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DetailAdmin;
