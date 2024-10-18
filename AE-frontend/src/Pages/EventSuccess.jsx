import React from "react";
import { Link } from "react-router-dom";

const EventSuccess = (props) => {
  const current = props.current;
  console.log(current);

  return (
    <>
      <div className="container vh-100">
        <div className="row">
          <div className="col-lg-6 offset-lg-3 mt-2">
            <div className="card">
              <div className="card-body text-center">
                <h2 className="card-title text-success">Event Registered</h2>
                <p className="card-text text-muted">
                  The Event registered Successfully, now add the sponsor the
                  speaker and the schedule of the event.
                </p>
                <div className="mt-4">
                  <Link
                    to={`/speaker/${current}`}
                    className="btn btn-primary ms-2"
                  >
                    Next
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventSuccess;
