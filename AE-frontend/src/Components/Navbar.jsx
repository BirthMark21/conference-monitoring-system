import React, { useContext, useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import Image from "../img/duresa.jpg";
import { EventContext } from "../MyContext";
import logo from "../../../AE-Admin-site/src/img/logo.png"

const Navbar = () => {
  const { user } = useContext(EventContext);
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const hideNavbar = /\/room/.test(location.pathname);

  useEffect(() => {
    // Fetch user data from local storage if available
    const storedUserData = localStorage.getItem("authData");
    if (storedUserData) {
      try {
        const parsedUserData = JSON.parse(storedUserData);
        setUserData(parsedUserData);
      } catch (error) {
        console.error("Error parsing storedUserData:", error);
      }
    } else {
      console.warn("No stored user data found.");
    }
  }, []);

  const handleGotoProfile = () => {
    navigate("/profile", { replace: true });
  };

  if (hideNavbar) {
    return null;
  }

  const logoStyle = {
    height: '50px',
    width: 'auto',

  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top py-3" id="myNav">
      <div className="container">
        <NavLink to="/home" className="navbar-brand fw-bold">
          <img src={logo} style={logoStyle} alt="" className="img" />
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto me-2 mb-2 mb-lg-0 d-flex align-items-center">
            <li className="nav-item">
              <NavLink to={user?.role} className="nav-link">
                Home
              </NavLink>
            </li>
            <li className="nav-item ms-auto me-2 mb-2 mb-lg-0">
              <div className="dropdown">
                <div className="nav-link dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                  Events
                </div>
                <ul className="dropdown-menu bg-dark">
                  <li>
                    <NavLink to="/events" className=" dropdown-item nav-link">
                      Virtual Events
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/abstract" className="dropdown-item nav-link">
                      Abstract Events
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/face-events" className="dropdown-item nav-link">
                      On-site Events
                    </NavLink>
                  </li>
                </ul>
              </div>
            </li>
            <li className="nav-item">
              <NavLink to="/about" className="nav-link">
                About
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/contact" className="nav-link">
                Contact
              </NavLink>
            </li>
            <li>
              {user && (
                <div className="card p-1 px-2 ms-3" onClick={handleGotoProfile}>
                  <div className="card-content d-flex justify-content-end align-items-center">
                    <p className="m-0">{userData?.fullname}</p>
                    <img
                      src={Image}
                      className="card-img ms-2"
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "100%",
                      }}
                      alt="Profile"
                    />
                  </div>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
