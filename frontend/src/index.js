import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./css/style.css";
import "./css/icon.css";
import "./css/card.css";
import "./css/home/nav.css";
import "./css/editor/input.css";
import "./css/editor/layout.css";
import "./css/editor/builder.css";
import "./css/editor/editor.css";
import "./css/editor/header.css";
import "./css/editor/response.css";
// import "./css/editor/settings.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    // <React.StrictMode>
    <App />
    // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
