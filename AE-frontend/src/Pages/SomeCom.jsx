import React from "react";
import CountdownTimer from "../Components/CountdownTimer";

const SomeCom = () => {
  // Set your target date and time here
  const targetDate = new Date("2023-09-13T16:41:00Z");

  return (
    <>
      <CountdownTimer targetDate={targetDate} />
    </>
  );
};

export default SomeCom;
