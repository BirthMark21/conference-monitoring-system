import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { EventProvider } from "./MyContext";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <EventProvider>
    <App />
  </EventProvider>
);
