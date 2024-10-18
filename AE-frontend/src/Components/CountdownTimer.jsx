import React, { useState, useEffect } from "react";

const CountdownTimer = ({ targetDate, onTimerFinish }) => {
  const calculateTimeLeft = () => {
    const now = new Date();
    const targetTime = targetDate;
    const timeDifference = targetTime - now;

    if (timeDifference <= 0) {
      if (onTimerFinish) {
        onTimerFinish();
      }
      return {
        months: "00",
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00",
      };
    }
    let months = targetTime.getUTCMonth() - now.getUTCMonth();
    let years = targetTime.getUTCFullYear() - now.getUTCFullYear();

    if (months < 0) {
      months += 12;
      years -= 1;
    }
    const days = String(
      Math.floor(timeDifference / (1000 * 60 * 60 * 24))
    ).padStart(2, "0");
    const hours = String(
      Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    ).padStart(2, "0");
    const minutes = String(
      Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
    ).padStart(2, "0");
    const seconds = String(
      Math.floor((timeDifference % (1000 * 60)) / 1000)
    ).padStart(2, "0");

    return { months, days, hours, minutes, seconds };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [targetDate, onTimerFinish]);

  return (
    <>
      <div>
        {timeLeft.months} <span>Months</span>
      </div>
      <div>
        {timeLeft.days} <span>Days</span>
      </div>
      <div>
        {timeLeft.hours} <span>Hours</span>
      </div>
      <div>
        {timeLeft.minutes} <span>Minutes</span>
      </div>
      <div>
        {timeLeft.seconds} <span>Seconds</span>
      </div>
    </>
  );
};

export default CountdownTimer;
