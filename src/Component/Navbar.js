import React from "react";
import { NavLink, Link } from "react-router-dom";

const Navbar = ({ signed }) => {
  var classState = "nav-link";
  if (!signed) {
    classState += " disabled";
  }
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link exact to="/" className="navbar-brand">
        Uni Utility
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div
        className="collapse navbar-collapse justify-content-end"
        id="navbarNav"
      >
        <ul className="navbar-nav">
          <li className="nav-item">
            <NavLink className="nav-link" exact to="/">
              Home
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/addStd">
              Add Student
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={classState} to="/addC">
              Add Courses
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/lookC">
              View Courses
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className={classState} to="/addR">
              Reviews
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
