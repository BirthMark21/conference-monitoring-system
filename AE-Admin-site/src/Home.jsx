// src/Home.jsx
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Nav from "./Nav";
import Events from "./Events";
import Dashboard from "./Dashboard";
import CreateEvent from "./CreateEvent";
import Users from "./Users";
import Speakers from "./Speakers";
import Sponsors from "./Sponsors";
import EventDetail from "./EventDetail";
import EventSpeaker from "./EventSpeaker";
import AddSpeaker from "./AddSpeaker";
import Sidebar from "./Sidebar";
import EventAttendee from "./EventAttendee";
import AddAttendee from "./AddAttendee";
import EventSponsor from "./EventSponsor";
import AddSponsor from "./AddSponsor";
import EventSchedule from "./EventSchedule";
import AddSchedule from "./AddSchedule";
import UpdateEvent from "./UpdateEvent";
import Room from "./Room";
import Packages  from "./Packages";
import Login from "./Login"; // Ensure the import path is correct
import Sharelink from "./Sharelink";
import Exhibitors from "./Exhibitors";
import Showcase from "./Showcase";
import Venues from "./Venues";
import FaceEvents from "./FaceEvents";
import Contents from "./Contents";
import ExhibitorBooths from "./ExhibitorBooths";
import PaperEase from "./PaperEase";
import Abstracts from "./Abstracts";
import Reviews from "./Reviews";
import ReviewerReport from "./ReviewerReport";
import Paper from "./Paper";
import Marks from "./Marks";
import Assign from "./Assign";
import EventsDetails from "./EventsDetails";
import TrackEvents from "./TrackEvents";
import EventUpdateTrack from "./EventUpdateTrack";
import SetAgenda from "./SetAgenda";
import ViewAgenda from "./ViewSchedule";
import AgendaManager from "./AgendaManager";
import Sessions from "./Sessions";
import Videos from "./Videos";
import Reviewers from  "./Reviewers";
function Home() {
  const [toggle, setTottle] = useState(true);
  const Toggle = () => {
    setTottle(!toggle);
  };

  return (
    <div className="container-fluid bg-white min-vh-100 overflow-hidden">
      <div className="row">
        {toggle && (
          <div className="col-4 col-md-2 bg-black vh-100 position-fixed">
            <Sidebar />
          </div>
        )}
        {toggle && <div className="col-4 col-md-2"></div>}
        <div className="col">
          <div className="dash-background px-3">
            <Nav Toggle={Toggle} />
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/events/:id/attendees" element={<EventAttendee />} />
              <Route
                path="/events/:id/attendees/add"
                element={<AddAttendee />}
              />
              <Route path="/events/:id/speakers" element={<EventSpeaker />} />
              <Route path="/events/:id/speakers/add" element={<AddSpeaker />} />
              <Route path="/events/:id/sponsors" element={<EventSponsor />} />
              <Route path="/events/:id/sponsors/add" element={<AddSponsor />} />
              <Route path="/events/:id/schedules" element={<EventSchedule />} />
              <Route
                path="/events/:id/schedules/add"
                element={<AddSchedule />}
              />
              <Route path="/events/create" element={<CreateEvent />} />
              <Route path="/events/:id/update" element={<UpdateEvent />} />

              <Route path="/users" element={<Users />} />
              <Route path="/packages" element={<Packages />} />
              <Route path="/speakers" element={<Speakers />} />
              <Route path="/sponsors" element={<Sponsors />} />
              <Route path="/room/:id" element={<Room />} />
              <Route path="/sharelink/:id" element={<Sharelink />} />
              <Route path="/exhibitors" element={<Exhibitors />} />
              <Route path="/venues" element={<Venues />} />
              <Route path="/showcase" element={<Showcase />} />
              <Route path="/face-events" element={<FaceEvents />} />
              <Route path="/contents" element={<Contents />} />
              <Route path="/packages/" element={<Packages />} />
              <Route path="/exhibitor-booths" element={<ExhibitorBooths />} />
              <Route path="/paperease" element={<PaperEase />} />
              <Route path="/abstracts" element={<Abstracts />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/reviewerreport" element={<ReviewerReport />} />
              <Route path="/paper" element={<Paper />} />
              <Route path="/marks" element={<Marks />} />
              <Route path="/assign" element={<Assign />} />
              <Route path= "/sessions" element={<Sessions />} />
              <Route path="/eventsdetails" element={<EventsDetails />} />
              <Route path="/trackevents" element={<TrackEvents />} />
              <Route path= "/eventupdatetrack " element={<EventUpdateTrack />} />
              <Route path= "/setagenda" element={<SetAgenda />} />
              <Route path= "/viewagenda" element={<ViewAgenda />} />
              <Route path= "/agendamanager" element={<AgendaManager />} />
              <Route path= "/videos" element={<Videos />} />
              <Route path= "/reviewers" element={<Reviewers />} />
             
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
