import React from 'react';
import { Link } from 'react-router-dom';
import './navBar.scss';

const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link className="navbar-brand" to="/">
        Bus Watcher
      </Link>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          {/* <NavLink className="nav-item nav-link" to="/"> */}
          {/* Маршруты */}
          {/* </NavLink> */}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
