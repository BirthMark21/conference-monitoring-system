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

/*
function App() {
  return (
    <Router>
      
      
      <ScrollToTop />
      <Routes>
      <Route  element={<Navbar />}/>
       <Route path="/" element={<Login />} />
       <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/speakers" element={<Speakers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/events" element={<Events />} />
        <Route path="/register/:id" element={<Register />} />
        <Route path="/addattendee" element={<Register />} />
        <Route path="/success" element={<Success />} />
        <Route path="/events/:id" element={<EventDetail />} />
        <Route path="/check" element={<SomeCom />} />
        <Route path="/users" element={<Users />}/>
        <Route path="/eventadd" element={<Eventadd />}/>
        <Route path="/addspeaker" element={<AddSpeaker />}/>
        <Route path="/admin" element={<Admin />}/>
        <Route path="/eventreg" element={<EventReg />}/>
        <Route path="/speaker/:id" element={<SpeakerReg />} />
        <Route path="/speakeradd" element={<SpeakerReg />} />
        <Route path="/eventreg" element={<EventReg />}/>
        <Route path="/attendee" element={<Attendee />} />
  <Route path="/exhibitor" element={<Exhibitor />} />
  <Route path="/room" element={<StreamRoom hidefooter={true} />} />
  <Route path="/roomlogin/:id" element={<RoomLogin />} />
  <Route path="/sponsor/:id" element={<SponsorReg />} />
  <Route path="/sponsors/add" element={<SponsorReg />} />
  <Route path="/attendee/add" element={<Addattendee />} />
  <Route path="/sponsor" element={<Sponsor />} />
  <Route path="/abstract" element={<Abstract />} />
  <Route path="/reviewer" element={<Reviewer />} />
  <Route path="/review" element={<Review />} />
  <Route path="/revieweradd" element={<Revieweradd />} />
  <Route path="/reviewadd" element={<Reviewadd />} />
  <Route path="/abstractadd" element={<Abstractadd />} />
  <Route path="/exhibitoradd" element={<Exhibitoradd />} />
  <Route path="/booth" element={<Exhibitorboose />} />
  <Route path="/boothadd" element={<Boothadd />} />
  <Route path="/exhibition" element={<Exhibitorshow />} />
  <Route path="/items" element={<Exhibitionitem />} />

      </Routes>
      <Footer />
    </Router>
  );
}*/

// Define a component to manage user authentication and routing

const App = () => {
  const [userType, setUserType] = useState(null);

  return (
    <Router>

     
      <Routes>

        <Route path="/" element={<Login setUserType={setUserType} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/events" element={<Events />} />
        <Route path="/abstract" element={ <Abstracts />} />
        <Route path="/events/:id" element={ <EventDetail />} />
        <Route path="/eventreg" element={<EventReg />}/>
        <Route path="/register/:id" element={<Register />} />
        <Route path="/speaker/:id" element={<SpeakerReg />} />
        <Route path="/admin" element={userType === 'admin' ? <Admin /> : <Navigate to="/login" />} />
        <Route
          path="/user" 
          element={userType === 'reviewer' ? <About /> : <Navigate to="/login" />}
        />
        <Route
          path="/speaker"
          element={userType === 'speaker' ? <Speakerdb /> : <Navigate to="/" />}
        />
        <Route
          path="/exhibitor"
          element={userType === 'exhibitor' ? <Exhibitordb/> : <Navigate to="/exhibitor" />}
        />
         <Route path="/home" element={userType === 'exhibitor' ?<Exhibitordb /> : <Navigate to="/login" />}/>
         <Route path="/booth" element={userType === 'exhibitor' ?<ExhibitorBooths /> : <Navigate to="/booth" />}/>
         <Route path="/exhibition" element={userType === 'exhibitor'? <Exhibitionitem /> : <Navigate to="/exhibition" />}/>
         

       
        <Route path="/attendee" element={userType === 'attendee' ? <Attendeedb />: <Navigate to="/" />} />
        <Route path="/home" element={ userType === 'attendee' ? <Attendeedb /> : <Navigate to="/home" />}/>
        <Route path="/about" element={userType === 'attendee' ?  <About />: <Navigate to="/about" /> } />
        <Route path="/contact" element={userType === 'attendee' ? <Contact />: <Navigate to="/contact" />} />
        <Route path="/events" element={userType === 'attendee' ? <Events />: <Navigate to="/" />} />
        
        <Route path="/profile" element={<Profile />} />
        <Route path="/attendee/:id" element={userType === 'attendee' ?<Home />: <Navigate to="/profile" />} />
       
        <Route path="/reviewer"element={userType === 'reviewer' ? <Reviewerdb /> : <Navigate to="/reviewer" />} />
        <Route path="/review" element={userType === 'reviewer' ?<Addreview />: <Navigate to="/reviewer"/>} />
        <Route path="/reviews" element={userType === 'reviewer' ?<Review />: <Navigate to="/reviewer"/>} />
        <Route  element={<Navbar />}/>
      </Routes>
    </Router>
  );
};

export default App;
