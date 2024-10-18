import React from "react";

const BackImg = ({ imageUrl, children }) => {
  const divStyle = {
    paddingTop: "10rem",
    backgroundImage: `linear-gradient(rgba(78, 87, 212, 0.507), rgba(78, 87, 212, 0.438)), url(${imageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "500px",
  };

  return <div style={divStyle}>{children}</div>;
};

export default BackImg;
