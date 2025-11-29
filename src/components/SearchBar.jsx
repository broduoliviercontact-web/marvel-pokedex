import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./SearchBar.css";

const SearchBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialName = params.get("name") || "";

  const [isComics, setIsComics] = useState(
    location.pathname.includes("/comics")
  );
  const [query, setQuery] = useState(initialName);

  useEffect(() => {
    setIsComics(location.pathname.includes("/comics"));
    setQuery(new URLSearchParams(location.search).get("name") || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.search]);

  const submitSearch = (e) => {
    if (e) e.preventDefault();
    const qs = new URLSearchParams();
    if (query && query.trim()) qs.set("name", query.trim());
    if (qs.get("page")) qs.delete("page");
    const base = isComics ? "/comics" : "/characters";
    const url = qs.toString() ? `${base}?${qs.toString()}` : base;
    navigate(url, { replace: false });
  };

  const onToggle = () => {
    setIsComics((prev) => !prev);
  };

  return (
    <form className="search-form" onSubmit={submitSearch}>
      <input
        className="search-input"
        type="search"
        placeholder={isComics ? "Search comics..." : "Search characters..."}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search"
      />

      {/* Button with SVG loupe + Marvel variant by default */}
      <button
        type="submit"
        className="search-button marvel"
        aria-label="Search"
        title="Search"
      >
        <span className="btntext" aria-hidden="true">
          {/* SVG loupe icon (inline, scalable) */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <path
              d="M21 21l-4.35-4.35"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle
              cx="11"
              cy="11"
              r="6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <div className="switch-wrapper" title="Switch Characters / Comics">
        <label className="switch-label">HEROES</label>

        <label className="switch" aria-hidden="false">
          <input
            type="checkbox"
            checked={isComics}
            onChange={onToggle}
            className="switch-checkbox"
          />
          <span className="switch-slider" />
        </label>

        <label className={`switch-label ${isComics ? "active" : ""}`}>
          Comics
        </label>
      </div>
    </form>
  );
};

export default SearchBar;
