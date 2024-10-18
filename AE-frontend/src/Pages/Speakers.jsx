import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { EventContext } from "../MyContext";

import duresaImage from "../img/duresa.jpg";
import chalaImage from "../img/chala.jpg";
import kumaImage from "../img/kuma.jpg";

const Speakers = () => {
  const { speakers } = useContext(EventContext);
  console.log(speakers);
  const firstThreeSpeakers = speakers.slice(0, 3);
  console.log(firstThreeSpeakers);
  const [allview, setAllview] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const toggleAllView = () => {
    setAllview((prevState) => !prevState);
    setShowAll((prevState) => !prevState);
  };

  return (
    <section id="speakers">
      <div className="container fade-in">
        <div className="row mt-2">
          {allview
            ? speakers.map((speaker, index) => (
                <div className="col-12 col-md-12 col-lg-4 mb-3" key={index}>
                  <div className="card text-light text-center bg-white pb-2 h-100">
                    <div className="card-body text-dark">
                      <div className="img-area mb-4">
                        <img
                          src={duresaImage}
                          className="card-img-top rounded-5"
                          alt=""
                        />
                      </div>
                      <h3 className="card-title">{speaker.fullname}</h3>
                      <p className="lead">{speaker.organization}</p>
                    </div>
                  </div>
                </div>
              ))
            : firstThreeSpeakers.map((speaker, index) => (
                <div className="col-12 col-md-12 col-lg-4" key={index}>
                  <div className="card text-light text-center bg-white pb-2 h-100">
                    <div className="card-body text-dark">
                      <div className="img-area mb-4">
                        <img
                          src={duresaImage}
                          className="card-img-top"
                          alt=""
                        />
                      </div>
                      <h3 className="card-title">{speaker.fullname}</h3>
                      <p className="lead">{speaker.organization}</p>
                    </div>
                  </div>
                </div>
              ))}

          {/* <div className="col-12 col-md-12 col-lg-4">
            <div className="card text-light text-center bg-white pb-2 h-100">
              <div className="card-body text-dark">
                <div className="img-area mb-4">
                  <img src={chalaImage} className="card-img-top" alt="" />
                </div>
                <h3 className="card-title">Chala Olani</h3>
                <p className="lead">
                  Computer Science and Engineering Student as Adama Science and
                  Technology University
                </p>
                <button className="btn bg-primary text-white">
                  learn More
                </button>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-12 col-lg-4">
            <div className="card text-light text-center bg-white pb-2 h-100">
              <div className="card-body text-dark">
                <div className="img-area mb-4">
                  <img src={kumaImage} className="card-img-top" alt="" />
                </div>
                <h3 className="card-title">Kuma Telila</h3>
                <p className="lead">
                  Computer Science and Engineering Student as Adama Science and
                  Technology University
                </p>
                <button className="btn bg-primary text-white">
                  Learn More
                </button>
              </div>
            </div> 
          </div>*/}
        </div>
        <div className="row mt-5 mb-5 text-center">
          <div className="col-12">
            {/* <Link to="/speakers" className="btn btn-warning rounded-pill">
              View All Speakers <FaArrowRight />
            </Link> */}
            <button
              className="btn btn-warning rounded-pill"
              onClick={toggleAllView}
            >
              {showAll ? "Show Less Speakers" : "View All Speakers"}{" "}
              {/* <FaArrowRight /> */}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Speakers;
