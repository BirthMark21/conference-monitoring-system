import React, { createContext, useState, useEffect } from "react";

// Create the context
const SpeakerContext = createContext();

// Create a provider component
const SpeakerProvider = ({ children }) => {
  const [speakers, setSpeakers] = useState([]);

  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000api/speakers/");
        if (!res.ok) {
          throw new Error("Failed to fetch speakers");
        }
        const data = await res.json();

        setSpeakers(data);
      } catch (error) {
        console.error("Error fetching speakers:", error);
        // Handle error, e.g., setSpeakers([]);
      }
    };

    fetchSpeakers();
  }, []);

  const contextValue = {
    speakers,
  };

  return (
    <SpeakerContext.Provider value={contextValue}>
      {children}
    </SpeakerContext.Provider>
  );
};

export { SpeakerProvider, SpeakerContext };
