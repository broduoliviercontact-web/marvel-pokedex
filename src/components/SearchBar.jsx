import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../config";
import "./SearchBar.css";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState("characters"); // "characters" | "comics"

  const navigate = useNavigate();
  const location = useLocation();
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  // Déterminer le mode par défaut selon l'URL
  useEffect(() => {
    if (location.pathname.startsWith("/comics")) {
      setMode("comics");
    } else if (location.pathname.startsWith("/characters")) {
      setMode("characters");
    }
  }, [location.pathname]);

  // Synchroniser le champ avec ?name=
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const nameParam = params.get("name") || "";
    setQuery(nameParam);
  }, [location.search]);

  // Quand on change de mode, on vide les suggestions
  useEffect(() => {
    setSuggestions([]);
    setIsOpen(false);
  }, [mode]);

  // Autocomplete avec debounce + filtrage front
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const trimmed = query.trim();
    if (!trimmed) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        setIsLoading(true);

        const endpoint = mode === "characters" ? "/characters" : "/comics";

        const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
          params: {
            name: trimmed,
            limit: 100,
            skip: 0,
          },
        });

        const results = Array.isArray(response.data?.results)
          ? response.data.results
          : [];

        const lower = trimmed.toLowerCase();

        const allLabels = results
          .map((item) => (mode === "characters" ? item.name : item.title))
          .filter(Boolean);

        const labels = allLabels
          .filter((label) => label.toLowerCase().includes(lower))
          .slice(0, 8);

        setSuggestions(labels);
        setIsOpen(labels.length > 0);
      } catch (err) {
        console.error("Autocomplete error:", err);
        setSuggestions([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, mode]);

  // Fermer la liste quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToSearch = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const path = mode === "characters" ? "/characters" : "/comics";
    navigate(`${path}?name=${encodeURIComponent(trimmed)}`);
    setIsOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    goToSearch(query);
  };

  const handleSuggestionClick = (label) => {
    setQuery(label);
    goToSearch(label);
  };

  return (
    <div className="searchbar" ref={containerRef}>
      <div className="searchbar-top">
        <form className="searchbar-form" onSubmit={handleSubmit}>
          <input
            className="searchbar-input"
            type="text"
            placeholder={
              mode === "characters"
                ? "Search characters..."
                : "Search comics..."
            }
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
          />
          <button
            type="submit"
            className="searchbar-button"
            aria-label="Rechercher"
          >
            <span className="searchbar-icon">🔍</span>
          </button>
        </form>

        {/* Toggle Comics / Characters */}
        <div className="search-toggle" aria-label="Type de recherche">
          <button
            type="button"
            className={
              "search-toggle-btn" +
              (mode === "comics" ? " search-toggle-btn--active" : "")
            }
            onClick={() => setMode("comics")}
          >
            Comics
          </button>
          <button
            type="button"
            className={
              "search-toggle-btn" +
              (mode === "characters" ? " search-toggle-btn--active" : "")
            }
            onClick={() => setMode("characters")}
          >
            Characters
          </button>
        </div>
      </div>

      {isOpen && (
        <ul className="searchbar-suggestions">
          {isLoading && (
            <li className="searchbar-info">Recherche en cours…</li>
          )}
          {!isLoading && suggestions.length === 0 && (
            <li className="searchbar-info">Aucun résultat</li>
          )}
          {!isLoading &&
            suggestions.map((label) => (
              <li
                key={label}
                className="searchbar-suggestion"
                onClick={() => handleSuggestionClick(label)}
              >
                {label}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
