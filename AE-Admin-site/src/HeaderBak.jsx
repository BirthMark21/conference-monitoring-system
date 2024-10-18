import React from "react";

const HeaderAdmin = ({ imageUrl, children }) => {
  const divStyle = {
    backgroundImage: `linear-gradient(to left, rgba(78, 87, 212, 0.507) 100%, rgba(78, 87, 212, 0.438) 0%), url(${imageUrl})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "40px",
    borderRadius: "10px",
  };

  return <div style={divStyle}>{children}</div>;
};

export default HeaderAdmin;
