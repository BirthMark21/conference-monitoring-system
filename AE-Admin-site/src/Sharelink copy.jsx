import React, { useContext, useState } from "react";
import { EventContext } from "./MyContext";
import { useLocation, useNavigate } from "react-router-dom";

const Sharelink = () => {
  const [localhost, setLocalhost] = useState("https://localhost:5173/");

  const [roomid, setRoomid] = useState("");

  const handleChange = (e) => {
    setLocalhost(e.target.value);
  };

  const handleAdditionalTextChange = (e) => {
    setRoomid(e.target.value);
  };

  const { registerRoomid } = useContext(EventContext);

  //   const [eventid, setEventId] = useState();
  const location = useLocation();
  console.log(location);
  const url = location.pathname;

  const regex = /\/sharelink\/(\d+)/;

  const match = url.match(regex);

  let eventid = null;
  if (match) {
    const number = match[1];
    eventid = number.toString();
  } else {
    console.log("Number not found in URL");
  }

  // const finalurl = `${localhost}room/${eventid}?roomID=${roomid}&role=Audience`;
  const finalurl = `${roomid}`;

  const navigate = useNavigate();

  const handleRoomid = async (e) => {
    e.preventDefault();

    const roomData = {
      event: eventid,
      roomId: finalurl,
    };

    const handleSuccess = (registered) => {
      navigate(`/room/${eventid}?${roomid}`);
    };
    const handleError = () => {
      alert("register failed");
    };

    registerRoomid(roomData, handleSuccess, handleError);
  };

  return (
    <div className="container py-5 h-100">
      <div className="row d-flex justify-content-center align-items-center h-100">
        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
          <div className="card p-5">
            <div className="form-group">
              {/* <input
                type="text"
                className="form-control mb-2"
                placeholder="share link"
                value={roomid}
                onChange={(e) => setRoomid(e.target.value)}
                required
              ></input> */}
              <h2 className="text-center text-black fw-bold">Room Name</h2>
              <p className="text-center">Enter room Name and continue</p>
              <div>
                {/* Input field with predefined value */}
                {/* <input
                  type="text"
                  className="form-control w-100 mb-2"
                  value={localhost}
                  onChange={handleChange}
                  // Prevents editing of the predefined text
                /> */}
                {/* Input field for adding additional text */}
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="Enter the Room ID here..."
                  value={roomid}
                  onChange={handleAdditionalTextChange}
                />

                {/* Button to submit additional text */}
                <button
                  className="btn btn-primary w-100"
                  onClick={handleRoomid}
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sharelink;
