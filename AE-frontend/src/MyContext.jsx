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
  // const [getuser, setGetuser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [authTokens, setAuthTokens] = useState(() =>
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
 /*  useEffect(() => {
    const storedUser = localStorage.getItem("authData");
    const storedUserRole = localStorage.getItem("userRole");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedUserRole) {
      setUserRole(storedUserRole);
    }
  }, []);

  const loginUser = (userData, onSuccess, onError) => {
    fetch("http://127.0.0.1:8000/api/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          localStorage.setItem("authData", JSON.stringify(data.user));
          localStorage.setItem("userRole", data.user.role); // Store user role
          onSuccess(data);
        } else {
          onError();
        }
      })
      .catch(onError);
  };*/
  const [user, setUser] = useState([]);
  console.log(user);

  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const eventsFromServer = await fetchEvents();
        const speakersFromServer = await fetchSpeakers();
        const sponsorsFromServer = await fetchSponsors();
        const attendeesFromServer = await fetchAttendees();
        const storedUser = localStorage.getItem("authData");
        
        // const userfromserver = await fetchUsers();
        setEvents(eventsFromServer);
        setSpeakers(speakersFromServer);
        setSponsors(sponsorsFromServer);
        setAttendees(attendeesFromServer);
        // setGetuser(userfromserver);
        const storedUserRole = localStorage.getItem("userRole");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
                 }
        if (storedUserRole) {
           setUserRole(storedUserRole);
          }
      } catch (error) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchEvents = async () => {
    const res = await fetch("http://127.0.0.1:8000/api/events/");
    if (!res.ok) {
      throw new Error("Failed to fetch events");
    }
    return res.json();
  };

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
    const res = await fetch("http://127.0.0.1:8000/api/attendees/");
    if (!res.ok) {
      throw new Error("Failed to fetch attendees");
    }
    return res.json();
  };

  // const fetchUsers = async () => {
  //   const res = await fetch(`http://127.0.0.1:8000/api/users/${user.user_id}/`);
  //   if (!res.ok) {
  //     throw new Error("Failed to fetch attendees");
  //   }
  //   const data = await res.json();
  //   console.log(data);
  //   const usersArray = [];
  //   usersArray.push(data);
  //   console.log(usersArray);

  //   return usersArray;
  // };

  const registerUser = async (userData, onSuccess, onError) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const data = await response.json();
        const { userdata, access, refresh } = data;
        console.log(data.user);
        setUser(data["user"]);

        await localStorage.setItem("authData", JSON.stringify(data["user"]));
        onSuccess(data);
      } else {
        onError();
      }
    } catch (error) {
      console.error("Registration error:", error);
      onError();
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

        const { user, access, refresh } = data;
        // const authData = { user, access, refresh };
        console.log(jwtDecode(access));
        setUser(data["user"]);
        setAuthTokens(data);

        localStorage.setItem("authData", JSON.stringify(user));
         localStorage.setItem("userRole", data.user.role); // Store user role
        onSuccess(data);
      } else {
        onError();
      }
    } catch (error) {
      console.error("Login error:", error);
      onError();
    }
  };
 /*const loginUser = (userData, onSuccess, onError) => {
  fetch("http://127.0.0.1:8000/api/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  })
    .then(response => response.json())
    .then(data => {
      if (data.user) {
        setUser(data.user);
        
        localStorage.setItem("authData", JSON.stringify(data.user));
        localStorage.setItem("userRole", data.user.role); // Store user role
        onSuccess(data);
      } else {
        onError();
      }
    })
    .catch(onError);
};*/
  const logoutUser = () => {
    try {
      localStorage.removeItem("authData");
      console.log(localStorage.getItem("authData"));
      setUser(null);
      setAuthTokens(null);
      console.log("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const contextValue = {
    events,
    loading,
    speakers,
    sponsors,
    attendees,
    error,
    loginUser,
    logoutUser,
    registerUser,
    user,
    // getuser,
  };

  return (
    <EventContext.Provider value={contextValue}>
      {children}
    </EventContext.Provider>
  );
};

export { EventProvider, EventContext };
