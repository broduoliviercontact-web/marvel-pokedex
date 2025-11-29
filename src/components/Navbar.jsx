import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import marvelLogo from "/marvel-logo.png";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="nav-brand">
          <img src={marvelLogo} alt="Marvel logo" className="nav-logo" />
          <span className="nav-title">Marvel Explorer</span>
        </Link>

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
    </nav>
  );
};

export default Navbar;
