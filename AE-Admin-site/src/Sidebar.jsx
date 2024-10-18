import React, { useContext, useEffect, useState } from "react";
import { EventContext } from "./MyContext";
import { useLocation, useNavigate } from "react-router-dom";
import logoVideo from "./videos/logo123.png"; // Ensure this path is correct
import avatar from "./img/Avatar.jpg";
import logo from "./img/logo.png";
import "./style.css";
// import Sharelink from "./Sharelink";
import Pill from "./Pill";
import useScreenRecorder from "./screenRec";

function Sidebar() {
  const [users, setUsers] = useState();
  console.log(users);

  useEffect(() => {
    const userDataString = sessionStorage.getItem("userData");
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      setUsers(userData.user);
    }
  }, []);
  const {
    startRecording,
    pauseRecording,
    blobUrl,
    resetRecording,
    resumeRecording,
    status,
    stopRecording,
  } = useScreenRecorder({ audio: true });

  const location = useLocation();
  const navigate = useNavigate();
  const { logoutUser } = useContext(EventContext);

  const handleLogout = async (e) => {
    e.preventDefault();
    logoutUser();
    navigate("/");
  };

  const isRoomPath = /\/room/.test(location.pathname);

  if (isRoomPath) {
    return null;
  }

  return (
    <div className="bg-dark p-2 vh-100 sidebar d-flex flex-column justify-content-between">
      <div className="wrapper">
        <div className="m-2 logo-container">
          {/* Replace the logo img with the video */}
          {/* <video 
            src={logoVideo} 
            className="logo-video" 
            autoPlay 
            loop 
            muted
          /> */}
          <img src={logo} alt="logo" className="img w-100" />
          <span className="brand-name fs-4"></span>
        </div>
        <hr className="text-dark" />
        <div className="list-group list-group-flush">
          <a href="/dashboard" className="list-group-item py-2">
            <i className="bi bi-speedometer2 fs-5 me-3"></i>
            <span>Dashboard</span>
          </a>

          {/* <a href="/dashboard" className="list-group-item py-2">
            <i className="bi bi-house fs-5 me-3"></i>
            <span>Home</span>
          </a> */}

          <a href="/events" className="list-group-item py-2">
            <i className="bi bi-table fs-5 me-3"></i>
            <span>Events</span>
          </a>
          <a href="/face-events" className="list-group-item py-2">
            <i className="bi bi-table fs-5 me-3"></i>
            <span>On-Site Events</span>
          </a>
          
          <a href="/exhibitors" className="list-group-item py-2">
            <i className="bi bi-shop fs-5 me-3"></i>
            <span>Exhibitors</span>
          </a>
          <a href="/exhibitor-booths" className="list-group-item py-2">
            <i className="bi bi-layout-text-sidebar-reverse fs-5 me-3"></i>
            <span>Exhibitor Booths</span>
          </a>
          <a href="/venues" className="list-group-item py-2">
            <i className="bi bi-geo-alt fs-5 me-3"></i>
            <span>Venues</span>
          </a>
          <a href="/contents" className="list-group-item py-2">
            <i className="bi bi-file-earmark-text fs-5 me-3"></i>
            <span>Contents</span>
          </a>
          <a href="/agendamanager" className="list-group-item py-2">
            <i className="bi bi-cart fs-5 me-3"></i>
            <span>Agenda</span>
          </a>
          <a href="/paperease" className="list-group-item py-2">
            <i className="bi bi-layout-text-sidebar-reverse fs-5 me-3"></i>
            <span>PaperEase</span>
          </a>
          <a href="/packages" className="list-group-item py-2">
            <i className="bi bi-box fs-5 me-3"></i>
            <span>Packages</span>
          </a>

          <a href="/speakers" className="list-group-item py-2">
            <i className="bi bi-megaphone fs-5 me-3"></i>
            <span>Speakers</span>
          </a>
          <a href="/sponsors" className="list-group-item py-2">
            <i className="bi bi-globe fs-5 me-3"></i>
            <span>Sponsors</span>
          </a>

          <a href="/users" className="list-group-item py-2">
            <i className="bi bi-people fs-5 me-3"></i>
            <span>Users</span>
          </a>

          <a className="list-group-item py-2" onClick={handleLogout}>
            <i className="bi bi-power fs-5 me-3"></i>
            <span>Logout</span>
          </a>
        </div>
      </div>

      {users && (
        <div className="card p-1 px-2 mb-4">
          <div className="card-content d-flex justify-content-end align-items-center">
            <figure className="text-end mb-0 me-2">
              <blockquote className="blockquote">
                <p>{users && users["username"]}</p>
              </blockquote>
              <figcaption className="blockquote-footer mb-0">
                <cite title="Source Title">{users && users["fullname"]}</cite>
              </figcaption>
            </figure>
            <img
              src={avatar}
              className="card-img ms-2"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "100%",
              }}
              alt="User Avatar"
            ></img>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;
