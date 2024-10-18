import React, { useContext, useEffect, useState } from "react";
import Image from "../img/duresa.jpg";
import { EventContext } from "../MyContext";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { events, logoutUser } = useContext(EventContext);
  const [user, setUser] = useState();

  console.log(events);

  const latestThree = events.slice(-3);
  console.log(latestThree.id);
  console.log(latestThree);
  const upcomingevents = events.filter((event) => event.status === "upcoming");
  console.log(upcomingevents);
  const firstSixEvents = upcomingevents.slice(0, Math.min(events.length, 6));
  console.log(firstSixEvents);
  const mostRecentEvent =
    firstSixEvents.length > 0
      ? firstSixEvents[firstSixEvents.length - 1]
      : null;
  useEffect(() => {
    const storedUserData = localStorage.getItem("authData");
    if (storedUserData) {
      setUser(JSON.parse(storedUserData));
    }
  }, []);
  console.log(localStorage.getItem("authData"));

  console.log(user);

  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/", { replace: true });
  };
  return (
    <>
      <Navbar />
      <section id="events">
        <div className="container vh-100">
          <div className="row mt-2 px-3">
            <div className="upcoming col-md-7 border p-4 fade-in vh-100">
              <h3 className="text-black fw-bold">Your Events</h3>
              <img
                        src={Image}
                        className="card-img-top rounded-circle"
                        alt=""
                      />
            </div>

            <div className="filters col-md-4 border p-4">
              <div className="col-12">
                <div className="card text-light text-center bg-white pb-2 h-100">
                  <div className="card-body text-dark pt-5 d-flex flex-column justify-content-center align-items-center">
                    <div
                      className="img-area mb-4 "
                      style={{ width: "100px", height: "100px" }}
                    >
                      <img
                        src={Image}
                        className="card-img-top rounded-circle"
                        alt=""
                      />
                    </div>
                    <h3 className="card-title">
                      {" "}
                      {user && <>{user["fullname"]}</>}
                    </h3>
                    <p className="lead"> {user && <>{user["email"]}</>}</p>
                    <p>{user && <>{user["role"]}</>}</p>
                    
                  </div>
                  <div className="container">
                    <button
                      className="btn btn-primary w-100"
                      onClick={handleLogout}
                    >
                      Log Out
                    </button>
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

export default Profile;
