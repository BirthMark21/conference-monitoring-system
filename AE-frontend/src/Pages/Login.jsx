import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EventContext } from "../MyContext";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { loginUser } = useContext(EventContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const userData = {
      username,
      password,
    };

    const handleSuccess = (data) => {
      // Redirect user based on their role
      switch (data.user.role) {
        case "attendee":
          navigate("/attendee");
          break;
        case "reviewer":
          navigate("/reviewer");
          break;
        case "exhibitor":
          navigate("/exhibitor");
          break;
        case "sponsor":
          navigate("/sponsor");
          break;
        case "speaker":
          navigate("/speaker");
          break;
        default:
          navigate("/home"); // Default redirect
      }
    };

    const handleError = (err) => {
      setError("Login failed. Please check your credentials and try again.");
    };

    // Attempt to log in the user and get their role from the backend
    loginUser(
      userData,
      (data) => {
        if (data.user && data.user.role) {
          handleSuccess(data);
        } else {
          handleError(new Error("Role not found"));
        }
      },
      handleError
    );
  };

  return (
    <section className="vh-100 gradient-custom">
      <div className="vh-100">
        <div className="container-fluid">
          <div className="row d-flex align-items-center">
            <div className="col-sm-6 text-black">
              <div className="d-flex align-items-center h-custom-2 px-5 ms-xl-4 mt-5 pt-5 pt-xl-0 mt-xl-n5">
                <form style={{ width: "23rem" }} onSubmit={handleLogin}>
                  <h3
                    className="fw-bold mb-3 pb-3 mb-5"
                    style={{ letterSpacing: "1px" }}
                  >
                    Log in
                  </h3>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <div data-mdb-input-init className="form-outline mb-4">
                    <label className="form-label" htmlFor="form2Example18">
                      Username
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="form2Example18"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div data-mdb-input-init className="form-outline mb-4">
                    <label className="form-label" htmlFor="form2Example28">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="form2Example28"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="pt-1 mb-5">
                    <button
                      data-mdb-button-init
                      data-mdb-ripple-init
                      className="btn btn-primary btn-lg btn-block"
                      type="submit"
                    >
                      Login
                    </button>
                  </div>

                  <p>
                    Don't have an account?{" "}
                    <Link to={"/signup"} className="primary-info">
                      Sign Up
                    </Link>
                  </p>
                </form>
              </div>
            </div>
            <div
              className="col-sm-6 px-0 d-none d-sm-block"
              id="loginimg"
            >
              <div className="d-flex flex-column justify-content-center vh-100 align-items-center">
                <h1 className="text-white display-1">
                  <span className="text-primary text-center">Event</span> Pulse
                </h1>
                <p className="text-white">
                  Live Streaming Meetup From all over the world
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
