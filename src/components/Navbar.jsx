import { Link, NavLink } from "react-router-dom";
import SearchBar from "./SearchBar";
import marvelLogo from "/marvel-logo.png";

import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="nav-left">
          <Link to="/" className="nav-brand">
            <img src={marvelLogo} alt="Marvel logo" className="nav-logo" />
            <span className="nav-title">Explorer</span>
          </Link>

          {/* trait de séparation */}
          <div className="navbar-divider" />

          <div className="nav-links">
            <NavLink
              to="/favorites"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " nav-link--active" : "")
              }
            >
              FAVORITES
            </NavLink>

            <NavLink
              to="/characters"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " nav-link--active" : "")
              }
            >
              HEROES
            </NavLink>

            <NavLink
              to="/comics"
              className={({ isActive }) =>
                "nav-link" + (isActive ? " nav-link--active" : "")
              }
            >
              COMICS
            </NavLink>
          </div>
        </div>

        <div className="nav-search">
          <SearchBar />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
