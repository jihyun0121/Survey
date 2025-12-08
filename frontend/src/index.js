import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./css/nav.css";
import "./css/handle.css";
import "./css/header.css";
import "./css/chart.css";
import "./css/base/style.css";
import "./css/ui/icon.css";
import "./css/ui/card.css";
import "./css/ui/input.css";
import "./css/pages/editor.css";
import "./css/pages/builder.css";
import "./css/pages/answer.css";
import "./css/pages/complete.css";
import "./css/pages/response.css";

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
