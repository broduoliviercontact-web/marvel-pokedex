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

  const navigate = useNavigate();
  const location = useLocation();
  const debounceRef = useRef(null);
  const containerRef = useRef(null);

  // Synchronise la barre avec le paramètre ?name= quand on est sur /characters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const nameParam = params.get("name") || "";
    setQuery(nameParam);
  }, [location.search]);

  // Autocomplete : appelle l’API après un petit délai
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
        const response = await axios.get(`${API_BASE_URL}/characters`, {
          params: {
            name: trimmed,
            limit: 8,
            skip: 0,
          },
        });

        const results = Array.isArray(response.data?.results)
          ? response.data.results
          : [];

        const names = results
          .map((c) => c.name)
          .filter(Boolean);

        setSuggestions(names);
        setIsOpen(names.length > 0);
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
  }, [query]);

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
    navigate(`/characters?name=${encodeURIComponent(trimmed)}`);
    setIsOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    goToSearch(query);
  };

  const handleSuggestionClick = (name) => {
    setQuery(name);
    goToSearch(name);
  };

  return (
    <div className="searchbar" ref={containerRef}>
      <form className="searchbar-form" onSubmit={handleSubmit}>
        <input
          className="searchbar-input"
          type="text"
          placeholder="Search characters..."
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

      {isOpen && (suggestions.length > 0 || isLoading) && (
        <ul className="searchbar-suggestions">
          {isLoading && (
            <li className="searchbar-info">Chargement…</li>
          )}
          {!isLoading &&
            suggestions.map((name) => (
              <li
                key={name}
                className="searchbar-suggestion"
                onClick={() => handleSuggestionClick(name)}
              >
                {name}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;
