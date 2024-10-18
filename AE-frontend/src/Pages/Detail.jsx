import { format } from "date-fns";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { BiTimeFive } from "react-icons/bi";
import { MdNotes } from "react-icons/md";
import BackImg from "../Components/BackImg";
import { useLocation } from "react-router-dom";
import CountdownTimer from "../Components/CountdownTimer";
import imageUrl from "../img/back_banner.webp";
import image5 from "../img/5.jpg.webp";
import telebirr from "../img/Telebirr.png";
import { useEffect, useState } from "react";
import Register from "./Register";

const EventDetail = () => {
  const [startevent, setStartevent] = useState(false);
  const imageUrl = "/images/back_banner.webp";
  const [endEvent, setEndevent] = useState(false);
  const [link, setLink] = useState();
  const [isRegistered, setIsRegistered] = useState(false);
  const [user, setUser] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    const storedUserData = localStorage.getItem("authData");
    if (storedUserData) {
      setUser(JSON.parse(storedUserData));
    }
  }, []);
  console.log(localStorage.getItem("authData"));

  console.log(user);
  const thisUser = user && user["fullname"];
  const thisUserEmail = user && user["email"];

  const handleRegistrationSuccess = () => {
    setIsRegistered(true);
    navigate("/events");
    window.location.reload();
  };

  // console.log(link);

  useEffect(() => {
    if (link !== null) {
      const resetTimer = setTimeout(() => {
        setLink(null);
      }, 60000);

      return () => clearTimeout(resetTimer);
    }
  }, [link]);

  const location = useLocation();

  const data = location.state;
  console.log(data.event.attendees);
  const attendees = data.event.attendees;
  const registeredUser = attendees.filter(
    (e) => e.fullname === thisUser && e.email === thisUserEmail
  );
  console.log(registeredUser);

  const targetDate = new Date(data.event.start_date);
  const endDate = new Date(data.event.end_date);
  const regStartDate = new Date(data.event.registration_start_date);
  const regEndDate = new Date(data.event.registration_end_date);

  useEffect(() => {
    const lastLink = data.event.roomids;
    if (lastLink.length !== 0) {
      setLink(lastLink[lastLink.length - 1].roomId);
    }
  }, [data]);

  useEffect(() => {
    const now = new Date();
    if (now > endDate) {
      setEndevent(true);
    }
  }, [endDate]);

  const options = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  };

  // const regoptions = {
  //   weekday: "long", // Full weekday name
  //   day: "numeric", // Day of the month
  //   month: "long", // Full month name
  //   year: "numeric", // 4-digit year
  //   hour: "numeric", // Hour in 24-hour format
  //   minute: "numeric",
  //   second: "numeric",
  // };

  const handleTimeFinsih = () => {
    setStartevent(true);
  };

  if (!data.event) {
    return <div>Event not found</div>;
  }

  const handleGoLive = () => {
    // window.location.href = `${link}`;
    if (link !== null) {
      navigate(`/room/${link}`);
    }
    // console.log("hello world");
  };

  return (
    <>
      <section id="event-detail">
        <BackImg imageUrl={imageUrl} className="container">
          <div className="row">
            <div className="col-12 text-center mb-5">
              <h1 className="text-capitalize mt-5 text-white fw-semiblod display-6">
                {data.event.title}
              </h1>
              <h5 className="text-white mt-3 mb-3">
                {targetDate.toLocaleString("en-US", options)} -{" "}
                {data.event.address}, {data.event.location}
              </h5>
              {(() => {
                if (!endEvent) {
                  if (!startevent) {
                    return (
                      <div className="mt-4">
                        {registeredUser.length === 0 && (
                          <Register
                            eventId={data.event.id}
                            FullName={user && user["fullname"]}
                            Email={user && user["email"]}
                            AvailableSeat={data.event.availableSeat}
                            Attendee={data.event.attendees.length}
                            onRegistrationSuccess={handleRegistrationSuccess}
                          />
                        )}
                        {registeredUser.length !== 0 && (
                          <button className="btn btn-light  ms-2">
                            You are Registered
                          </button>
                        )}
                        {/* <Link
                          to={`/register/${data.event.id}`}
                          className="btn btn-light ms-2"
                        >
                          Register Now
                        </Link> */}
                        {/* <button className="btn btn-light ms-2">
                          Coming Soon
                        </button> */}
                      </div>
                    );
                  } else {
                    return (
                      <div className="mt-4">
                        {/* <Link
                          to={`/roomlogin/${data.event.id}`}
                          className="btn btn-danger light ms-2"
                        >
                          Go Live
                        </Link> */}
                        {link !== null || link !== undefined ? (
                          <button
                            onClick={handleGoLive}
                            className="btn btn-danger light ms-2"
                          >
                            Go Live
                          </button>
                        ) : (
                          <button
                            className="btn btn-danger light ms-2"
                            onClick={handleGoLive}
                          >
                            Waiting...
                          </button>
                        )}
                      </div>
                    );
                  }
                } else {
                  return (
                    <div className="mt-4">
                      <button className="btn btn-secondary light ms-2">
                        Passed
                      </button>
                    </div>
                  );
                }
              })()}
            </div>
          </div>
        </BackImg>
      </section>

      <section className="mt-5" id="about_event">
        <div className="container">
          <div className="row d-flex align-items-center">
            <div className="col-lg-4 col-md-12 col-12">
              <div className="about-img">
                <img src={imageUrl} alt="" className="card-img-top rounded" />
              </div>
            </div>
            <div className="col-lg-8 col-md-12 col-12 ps-lg-5 ">
              <div className="about-text">
                <h2>ABOUT THE EVENT</h2>
                <p className="text-muted">{data.event.description}</p>
                <p className="card-text">
                  <span className="text-muted">Registration: </span>
                  <b>
                    {new Date(
                      data.event.registration_start_date
                    ).toLocaleString("en-US")}
                  </b>
                  {"  "}-{"  "}
                  <b>
                    {new Date(data.event.registration_end_date).toLocaleString(
                      "en-US"
                    )}
                  </b>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5 py-5" id="timer_countdown">
        <div className="container py-5">
          <div className="row">
            <div className="col-12 col-md-3">
              <h6>Event Date</h6>
              <h4>Time is ticking, secure your seat now!</h4>
            </div>
            <div className="col-12 col-md-9">
              <div id="clock">
                <CountdownTimer
                  targetDate={targetDate}
                  onTimerFinish={handleTimeFinsih}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5" id="speakers">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div
                className="section-header text-center pb-5 mx-auto"
                style={{ maxWidth: "800px" }}
              >
                <p>OUR SPEAKINGS</p>
                <h4>WHO'S SPEAKING</h4>
              </div>
            </div>
          </div>
          <div className="row">
            {data.event.speakers.map((speaker, index) => (
              <div className="col-12 col-md-12 col-lg-4" key={index}>
                <div className="card text-light text-center bg-white pb-2 h-100">
                  <div className="card-body text-dark">
                    <div className="img-area mb-4">
                      <img src={image5} className="card-img-top" alt="" />
                    </div>
                    <h3 className="card-title">
                      {speaker.fullname.toUpperCase()}
                    </h3>
                    <p>
                      <span className="lead">{speaker.role}</span> <br />
                      Organization: <b>{speaker.organization}</b>
                    </p>
                    {/* <button className="btn bg-warning text-dark">
                      learn More
                    </button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div
                className="section-header text-center pb-5 mx-auto"
                style={{ maxWidth: "800px" }}
              >
                <p>OUR TIMETABLE</p>
                <h4>SCHEDULE PLAN</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="scheduales mx-auto text-white rounded px-5 py-3 max-height-340">
        <div className="container">
          <div className="row my-3 py-3 d-flex align-items-center text-center">
            <div className="col-md-4">
              <h5>
                <b>DATE</b>
              </h5>
            </div>
            <div className="col-md-4">
              <h5>
                <b>TIME</b>
              </h5>
            </div>
            <div className="col-md-4">
              <h5>
                <b>ACTIVITY</b>
              </h5>
            </div>
          </div>

          {data.event.schedules.map((schedule, index) => (
            <div
              className="row my-3 py-3 d-flex align-items-center scheduale rounded text-center"
              key={index}
            >
              <div className="col-md-4">
                <p>
                  <MdNotes color="#e83e8c" /> {schedule.date}
                </p>
              </div>
              <div className="col-md-4">
                <p>
                  <BiTimeFive color="#e83e8c" /> {schedule.start_time} -{" "}
                  {schedule.end_time}
                </p>
              </div>
              <div className="col-md-4">
                <p>{schedule.activity}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-5">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div
                className="section-header text-center pb-5 mx-auto"
                style={{ maxWidth: "800px" }}
              >
                <a
                  href={`http://127.0.0.1:8000/api/download-event-schedule-pdf/${data.event.id}/`}
                  className="btn btn-secondary"
                >
                  DOWNLOAD SCHEDULE (PDF)
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5" id="sponsors">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div
                className="section-header text-center pb-5 mx-auto"
                style={{ maxWidth: "800px" }}
              >
                <p>PARTNERS & SPONSORS</p>
                <h4>OFFICIAL SPONSOR</h4>
              </div>
            </div>
          </div>
          <div className="row">
            {data.event.sponsors.map((sponsor, index) => (
              <div className="col-12 col-md-12 col-lg-4" key={index}>
                <div className="card text-light text-center bg-white pb-2 h-100">
                  <div className="card-body text-dark">
                    <img src={telebirr} className="card-img-top" alt="" />
                    <h3 className="card-title mt-5">{sponsor.name}</h3>
                    <p className="lead">{sponsor.description}</p>
                    {/* <button className="btn bg-warning text-dark">
                      learn More
                    </button> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default EventDetail;
