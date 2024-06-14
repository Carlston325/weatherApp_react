import React from "react";
import Weather from "./Weather";
import "./App.css";

function App() {
  return (
    <>
      <div className="container">
        <Weather />
      </div>
      <div className="footer-info">
        Developed by{" "}
        <a
          target="_blank"
          href="https://carlston325.github.io/portfolio_static/"
        >
          Carlston Rebelo
        </a>
      </div>
    </>
  );
}

export default App;
