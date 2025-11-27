import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Navbar({ showBack }) {
    const navigate = useNavigate();

    return (
        <nav className="navbar navbar-light bg-white">
            {showBack && (
                <button className="icon-btn no-propagation back-btn" data-tooltip="뒤로가기" onClick={() => navigate(-1)}>
                    <i className="bi bi-arrow-left"></i>
                </button>
            )}

            <div className="d-flex align-items-center justify-content-between">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <i className="bi bi-ui-checks-grid me-2"></i>
                </Link>
            </div>
        </nav>
    );
}
