import React, { useContext, useState } from "react";
import { EventContext } from "../MyContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const RoomLogin = () => {
  const { id } = useParams();
  console.log(id);
  const navigate = useNavigate();
  const { loginUser } = useContext(EventContext);
  //   const [verified, setVerified] = useState(false);
  const location = useLocation();
  console.log(location);
  const data = location.pathname;
  console.log(data);
  const event_id = parseInt(id, 10);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData(event.target);
      const email = formData.get("email");
      const fullname = formData.get("fullName");

      const userData = await loginUser(event_id, email, fullname);
      //   setVerified(true);
      navigate("/room", { replace: true });

      console.log("User logged in:", userData);
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <section id="register">
      <div className="container min-vh-100">
        <div className="row">
          <div className="col-lg-8 offset-lg-2 mt-2">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title text-center">Login</h2>
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-3 mt-3">
                    <div className="row">
                      <div className="mb-3">
                        <label htmlFor="fullName" className="form-label">
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="fullName"
                          name="fullName"
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                          Email Address
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-primary w-100">
                    Register
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomLogin;
