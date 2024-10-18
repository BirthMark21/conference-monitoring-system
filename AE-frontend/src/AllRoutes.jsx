import React,{ useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import About from "./Pages/About";
import Events from "./Pages/Events";
import Home from "./Pages/Home";
import Register from "./Pages/Register";
import Success from "./Pages/Success";
import Contact from "./Pages/Contact";
import EventDetail from "./Pages/Detail";
import Speakers from "./Pages/Speakers";
import ScrollToTop from "./Components/ScrollToTop";
import SomeCom from "./Pages/SomeCom";
import Admin from "./Pages/Admin";
import SpeakerReg from "./Components/SpeakerReg";
import SponsorReg from "./Components/SponsorReg";
import ScheduleReg from "./Components/ScheduleReg";
import EventReg from "./Pages/EventReg";
import StreamRoom from "./Pages/StreamRoom";
import Lobby from "./Pages/Lobby";
import EventSuccess from "./Pages/EventSuccess";
import CountCard from "./Components/Admin/CountCard";
import RoomLogin from "./Pages/RoomLogin";
import DetailAdmin from "./Components/DetailAdmin";
import Login from "./Pages/Login";
import Abstracts from "./Pages/Abstract";
import Profile from "./Pages/Profile";
import ExhibitorBooths from "./Pages/ExhibitorBooth";
import Exhibitionitem from "./Pages/Exhibitionitems";
import Review from "./Pages/Review";
import Addreview from "./Pages/Addriview";
import Faceevents from "./Pages/Faceevents"
import ScreenRecording from "./Components/Admin/Recording";
import Exhibitordb from "./Pages/Exhibitordb";
import Reviewerdb from "./Pages/Reviewerdb";

const AllRoutes = () => {
  const [userType, setUserType] = useState(null);
  const isLoginPage =
    window.location.pathname === "/" || window.location.pathname === "/signin";
  return (
    <>
      {!isLoginPage && <Navbar />}
      <ScrollToTop />
      <Routes>
      <Route path="/" element={<Login setUserType={setUserType} />} />
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/speakers" element={<Speakers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/events" element={<Events />} />
        <Route path="/register/:id" element={<Register />} />
        <Route path="/success" element={<Success />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/check" element={<SomeCom />} />
        <Route path="/cards" element={<Admin />} />
        <Route path="/speaker/:id" element={<SpeakerReg />} />
        <Route path="/sponsor/:id" element={<SponsorReg />} />
        <Route path="/schedule/:id" element={<ScheduleReg />} />
        <Route path="/eventreg" element={<EventReg />} />
        <Route path="/eventsucces" element={<EventSuccess />} />
        <Route path="/room/:id" element={<StreamRoom hidefooter={true} />} />
        <Route path="/lobby/:id" element={<Lobby />} />
        <Route path="/Admin" element={<CountCard />} />
        <Route path="/roomlogin/:id" element={<RoomLogin />} />
        <Route path="/admindetail/:id" element={<DetailAdmin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/record" element={<ScreenRecording />} />
        <Route path="/abstract" element={<Abstracts />} />
        <Route path="/booth" element={<ExhibitorBooths />}/>
         <Route path="/exhibition" element={<Exhibitionitem /> }/>
         <Route path="/review" element={<Addreview />} />
        <Route path="/reviews" element={<Review />} />
        <Route path="/face-events" element={<Faceevents/>} />
        <Route path="/user" element={<About />}/>
        <Route path="/exhibitor" element={ <Exhibitordb />}/>
        <Route path="/reviewer" element={ <Reviewerdb />}/>
        <Route path="/speaker" element={ <Home />}/>
        <Route path="/attendee" element={ <Home />}/>
        
      </Routes>
      {!isLoginPage && <Footer />}
    </>
  );
};

export default AllRoutes;
