import React, { useRef } from "react";

import Pill from "./Pill";
import useScreenRecorder from "../../screenRec";

const App = () => {
  const {
    startRecording,
    pauseRecording,
    blobUrl,
    resetRecording,
    resumeRecording,
    status,
    stopRecording,
  } = useScreenRecorder({ audio: true });

  const videoRef = useRef();

  return (
    <div id="container">
      {/* <Navbar /> */}

      <div className="wrapper">
        <div className="pills">
          <Pill title="Status" value={status} />
          <Pill
            style={{ flexGrow: 1 }}
            title="Blob URL"
            value={blobUrl || "Waiting..."}
          />
        </div>

        <div>
          <video
            ref={videoRef}
            src={blobUrl}
            // poster={process.env.PUBLIC_URL + "/poster.png"}
            controls
            autoPlay
          />
        </div>

        <div className="btn btn-secondary">
          {(status === "idle" ||
            status === "permission-requested" ||
            status === "error") && (
            <button onClick={startRecording}>Start recording</button>
          )}
          {(status === "recording" || status === "paused") && (
            <button className="btn btn-danger" onClick={stopRecording}>
              Stop recording
            </button>
          )}
          {(status === "recording" || status === "paused") && (
            <button
              className="btn-secondary"
              onClick={() =>
                status === "paused" ? resumeRecording() : pauseRecording()
              }
            >
              {status === "paused" ? "Resume recording" : "Pause recording"}
            </button>
          )}
          {status === "stopped" && (
            <button
              onClick={() => {
                resetRecording();
                videoRef.current.load();
              }}
            >
              Reset recording
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default App;
