import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

// Create the context
const EventContext = createContext();

// Create a provider component
const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [speakers, setSpeakers] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [attendees, setAttendees] = useState([]);
  const [eventUsers, setEventusers] = useState([]);
  // const [getUserById, setGetUserById] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const [user, setUser] = useState(() =>
    sessionStorage.getItem("authTokens")
      ? jwtDecode(sessionStorage.getItem("authTokens"))
      : null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsFromServer = await fetchEvents();
        const speakersFromServer = await fetchSpeakers();
        const sponsorsFromServer = await fetchSponsors();
        const attendeesFromServer = await fetchAttendees();
        const eventusersFromServer = await fetchEventusers();
        // const getUserByIDFromServer = await fetchGetUserById();

        setSpeakers(speakersFromServer);
        setSponsors(sponsorsFromServer);
        setAttendees(attendeesFromServer);
        setEvents(eventsFromServer);
        setEventusers(eventusersFromServer);
        // setGetUserById(getUserByIDFromServer);
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchSpeakers = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/speakers/");
    if (!res.ok) {
      throw new Error("Failed to fetch speakers");
    }
    return res.json();
  };

  const fetchSponsors = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/sponsors/");
    if (!res.ok) {
      throw new Error("Failed to fetch sponsors");
    }
    return res.json();
  };

  const fetchAttendees = async () => {
    const res = await fetch(" http://127.0.0.1:8000/api/attendees/");
    if (!res.ok) {
      throw new Error("Failed to fetch attendees");
    }
    return res.json();
  };

  const fetchEvents = async () => {
    const res = await fetch(" http://127.0.0.1:8000/api/events/");
    if (!res.ok) {
      throw new Error("Failed to fetch events");
    }
    return res.json();
  };

  const fetchEventusers = async () => {
    const res = await fetch(" http://127.0.0.1:8000/api/eventusers/");
    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }
    return res.json();
  };

  const addSpeaker = async (speakerData, onSuccess, onError) => {
    try {
      const res = await fetch(" http://127.0.0.1:8000/api/speakers/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(speakerData),
      });

      if (res.ok) {
        const data = await res.json();
        setSpeakers((prevSpeakers) => [...prevSpeakers, data]);
        onSuccess(data);
      } else {
        onError();
      }
    } catch (error) {
      console.error("speaker registration error:", error);
      onError();
    }
  };
  const addSponsor = async (sponsorData, onSuccess, onError) => {
    try {
      const res = await fetch(" http://127.0.0.1:8000/api/sponsors/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sponsorData),
      });

      if (res.ok) {
        const data = await res.json();
        setSpeakers((prevSpeakers) => [...prevSpeakers, data]);
        onSuccess(data);
      } else {
        onError();
      }
    } catch (error) {
      console.error("sponsor registration error:", error);
      onError();
    }
  };
  // const fetchGetUserById = async () => {
  //   const res = await fetch("api/users/<int:user_id>/");
  //   if (!res.ok) {
  //     throw new Error("failed to fetch user by id");
  //   }
  //   return res.json();
  // };

  // const getEvent = async (eventId) => {
  //   const res = await fetch(`http://10.240.68.67:8000/api/event/${eventId}`);
  //   const data = await res.json();
  //   return data.data;
  // };

  const createEvent = async (newEventData, onSuccess, onError) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/events/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newEventData),
      });

      if (res.status === 201) {
        const createdEvent = await res.json();
        setEvents([...events, createdEvent]);
        onSuccess(createdEvent);
      } else {
        onError();
      }
    } catch (error) {
      onError();
    }
  };

  const editEvent = async (eventId, updatedEventData, onSuccess, onError) => {
    try {
      const res = await fetch(` http://127.0.0.1:8000/api/events/${eventId}/`, {
        method: "PUT", // Use PUT or PATCH method for editing
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEventData),
      });

      if (res.status === 200) {
        const updatedEvent = await res.json();
        // Update the events state to reflect the changes
        const updatedEvents = events.map((event) =>
          event.id === eventId ? updatedEvent : event
        );
        setEvents(updatedEvents);
        onSuccess(updatedEvent);
      } else {
        onError();
      }
    } catch (error) {
      onError();
    }
  };

  const toggleUserIsStaffById = async (userId, onSuccess, onError) => {
    try {
      // Fetch the current user data
      const response = await fetch(
        ` http://127.0.0.1:8000/api/eventusers/${userId}/`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const userData = await response.json();

      // Toggle the is_staff field
      const updatedIsStaff = !userData.is_staff;

      // Update the user with the new is_staff value and include other fields
      const updateResponse = await fetch(
        ` http://127.0.0.1:8000/api/eventusers/${userId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: userData.username,
            fullname: userData.fullname,
            email: userData.email,
            password: userData.password,
            is_staff: updatedIsStaff,
          }),
        }
      );

      if (updateResponse.status === 200) {
        const updatedUser = await updateResponse.json();
        onSuccess(updatedUser);
      } else {
        onError();
      }
    } catch (error) {
      console.error("Error toggling user is_staff status:", error);
      onError();
    }
  };

  const deleteEvent = async (eventId, onSuccess, onError) => {
    try {
      const response = await fetch(
        ` http://127.0.0.1:8000/api/events/${eventId}/`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // Find the index of the event to be deleted in the local state
        const eventIndex = events.findIndex((event) => event.id === eventId);
        if (eventIndex !== -1) {
          // Create a new array without the deleted event
          const updatedEvents = [...events];
          updatedEvents.splice(eventIndex, 1);
          setEvents(updatedEvents);
          console.log("Event deleted successfully");
          onSuccess(); // Call the success callback
        }
      } else {
        console.error("Failed to delete event");
        onError(); // Call the error callback
      }
    } catch (error) {
      console.error("An error occurred while deleting the event", error);
      onError(); // Call the error callback
    }
  };
  const loginUser = async (userData, onSuccess, onError) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
  
      if (response.ok) {
        const data = await response.json();
        const user = data.user;
  
        console.log(user.role);
  
        // Define the allowed roles
        const allowedRoles = [
          'attendee',
          'event_organizer',
          'speaker',
          'sponsor',
          'exhibitor',
          'admin',
          'reviewer'
        ];
  
        if (allowedRoles.includes(user.role)) {
          sessionStorage.setItem("userData", JSON.stringify(data));
          onSuccess(data);
        } else {
          onError("Unauthorized access: You do not have the required role to log in.");
        }
      } else {
        onError("Unable to log in with provided credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      onError("An error occurred during login. Please try again later.");
    }
  };
  
  const logoutUser = () => {
    sessionStorage.removeItem("userData");
    setAuthTokens(null);
    setUser(null);
    console.log(sessionStorage.getItem("userData"));
  };
  
  const registerAttendee = async (attendeeData, onSuccess, onError) => {
    try {
      const response = await fetch(
        " http://127.0.0.1:8000/api/attendee/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(attendeeData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        onSuccess(data); // Send the entire response data to the success callback
      } else {
        onError();
      }
    } catch (error) {
      console.error("Attendee registration error:", error);
      onError();
    }
  };

  const registerSpeaker = async (speakerData, onSuccess, onError) => {
    try {
      const response = await fetch(
        " http://127.0.0.1:8000/api/speaker/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(speakerData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSpeakers((prevSpeakers) => [...prevSpeakers, data]);
        onSuccess(data); // Send the entire response data to the success callback
      } else {
        onError();
      }
    } catch (error) {
      console.error("speaker registration error:", error);
      onError();
    }
  };

  const registerSponsor = async (sponsorData, onSuccess, onError) => {
    try {
      const response = await fetch(
        " http://127.0.0.1:8000/api/sponsor/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(sponsorData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        onSuccess(data); // Send the entire response data to the success callback
      } else {
        onError();
      }
    } catch (error) {
      console.error("sponsor registration error:", error);
      onError();
    }
  };

  const registerSchedule = async (scheduleData, onSuccess, onError) => {
    try {
      const response = await fetch(
        " http://127.0.0.1:8000/api/schedule/register/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(scheduleData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        onSuccess(data); // Send the entire response data to the success callback
      } else {
        onError();
      }
    } catch (error) {
      console.error("schedule registration error:", error);
      onError();
    }
  };

  const registerRoomid = async (roomData, onSuccess, onError) => {
    try {
      const response = await fetch(
        " http://127.0.0.1:8000/api/roomId/register/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(roomData),
        }
      );

      if (response.ok) {
        const data = await response.json();
        onSuccess(data);
      } else {
        onError();
      }
    } catch (error) {
      console.error("failed to send room id:", error);
      onError();
    }
  };

  const updateUserIsStaffById = async (userId, isStaff) => {
    try {
      const response = await fetch(`http://127.0.0.1:800/api/users/${userId}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_staff: isStaff }),
      });

      if (!response.ok) {
        throw new Error("Failed to update user is_staff status");
      }

      const updatedUserData = await response.json();
      return updatedUserData;
    } catch (error) {
      console.error("Error updating user is_staff status:", error);
      throw error;
    }
  };

  const contextValue = {
    events,
    toggleUserIsStaffById,
    createEvent,
    editEvent,
    deleteEvent,
    loginUser,
    user,
    logoutUser,
    registerAttendee,
    registerSpeaker,
    registerSponsor,
    registerSchedule,
    registerRoomid,
    updateUserIsStaffById,
    addSpeaker,
    addSponsor,
    // getEvent,
    // getUserById,
    eventUsers,
    speakers,
    sponsors,
    attendees,
    loading,
    error,
  };

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
};

export { EventProvider, EventContext };
