import React from "react";

const VideoComponent = () => {
  return (
    <video
      playsInline="playsinline"
      autoPlay="autoplay"
      muted="muted"
      loop="loop"
    >
      <source src={require("../img/success.mp4")} type="video/mp4"></source>
    </video>
  );
};

export default VideoComponent;
