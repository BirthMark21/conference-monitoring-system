import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Lobby = () => {
  const [roomId, setRoomId] = useState();
  const navigate = useNavigate();

  const handleJoin = () => {
    navigate(`/room/${roomId}`);
  };
  return (
    <>
      <section id="events" className="min-vh-100">
        <div className="container">
          <div className="row mt-3 justify-content-center mt-10">
            <div className="col-md-8 col-xl-6">
              <div className="card m-3 p-3">
                <div className="card-body">
                  <h3 className="card-title text-center">Lobby</h3>
                  <form>
                    <div className="mb-3 mt-4">
                      <div className="row">
                        <div className="col">
                          <label className="form-label text-center">
                            Enter the RoomID
                          </label>
                          <input
                            type="text"
                            className="form-control mb-3"
                            placeholder="channer name"
                            name="roomId"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                          ></input>

                          <button
                            className="btn btn-primary w-100"
                            type="submit"
                            onClick={handleJoin}
                          >
                            Join
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Lobby;
