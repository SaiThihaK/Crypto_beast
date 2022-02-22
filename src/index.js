import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import CryptoContent from "./CryptoContent";
import "./App.css";
import "react-alice-carousel/lib/alice-carousel.css";
ReactDOM.render(
  <React.StrictMode>
    <CryptoContent>
      <App />
    </CryptoContent>
  </React.StrictMode>,
  document.getElementById("root")
);
