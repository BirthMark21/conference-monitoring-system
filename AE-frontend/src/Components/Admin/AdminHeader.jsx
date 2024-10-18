import React, { useContext } from "react";
import HeaderAdmin from "./HeaderBak";
import State from "./State";
import { EventContext } from "../../MyContext";
import { Link } from "react-router-dom";
import imageUrl from "../../img/event.jpg";

const AdminHeader = () => {
  const { events } = useContext(EventContext);
  console.log(events);

  if (!events || events.length === 0) {
    return <div>Loading...</div>;
  }

  const upcomingevents = events.filter((event) => event.status === "upcoming");
  const firstSixEvents = upcomingevents.slice(0, Math.min(events.length, 6));

  const mostRecentEvent =
    firstSixEvents.length > 0
      ? firstSixEvents[firstSixEvents.length - 1]
      : null;

  return (
    <div className="container mt-5" id="headerAdmin">
      <div className="row">
        <div className="col">
          <HeaderAdmin imageUrl={imageUrl} className="card mt-3 p-5">
            <div className="card-title">
              <Link to={"/room"}>
                <State />
              </Link>

              <h1 className="mt-2 text-white">
                {mostRecentEvent ? mostRecentEvent.title : "No Recent Event"}
              </h1>
              <h5 className="text-white">
                Location:{" "}
                {mostRecentEvent ? mostRecentEvent.address : "Speaker"}
              </h5>
            </div>
            <div className="card-body mt-5 p-0">
              <div className="mt-5">
                <Link
                  to={`/speaker/${mostRecentEvent ? mostRecentEvent.id : 6}`}
                  className="btn btn-primary"
                >
                  Go Live Now
                </Link>
              </div>
            </div>
          </HeaderAdmin>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
