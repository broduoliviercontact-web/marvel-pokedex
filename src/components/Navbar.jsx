import { Link } from "react-router-dom";
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

          {/* Petit trait de séparation contrôlé en CSS */}
          <div className="navbar-divider" />

          <div className="nav-links">
            <Link to="/characters" className="nav-link">
              HEROES
            </Link>
            <Link to="/comics" className="nav-link">
              COMICS
            </Link>
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
