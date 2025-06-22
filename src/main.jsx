// main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css"; // or tailwind base if you're using it

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {" "}
      {/* ✅ This is the only place you use it */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
