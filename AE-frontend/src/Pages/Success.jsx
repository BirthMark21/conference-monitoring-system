import React from "react";

const Success = () => {
  return (
    <div className="container vh-100">
      <div className="row">
        <div className="col-lg-6 offset-lg-3 mt-2">
          <div className="card">
            <div className="card-body text-center">
              <h2 className="card-title text-success">
                Registration Successful!
              </h2>
              <p className="card-text text-muted">
                Thank you for registering for the event! We look forward to
                seeing you there.
              </p>
              <a href="/home" className="btn btn-primary">
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
