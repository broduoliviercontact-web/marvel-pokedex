import axios from "axios";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import getImageUrl from "../utils/getImageUrl";
import Pagination from "../components/Pagination";
import "../pages/pages.css";
import { API_BASE_URL } from "../config";

const Characters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const nameParam = searchParams.get("name") || "";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const limitParam = parseInt(searchParams.get("limit") || "20", 10);

  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const limit = Number.isNaN(limitParam) || limitParam < 1 ? 20 : limitParam;

  const [characters, setCharacters] = useState([]);
  const [searchInput, setSearchInput] = useState(nameParam);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(null);
  const [resultsLength, setResultsLength] = useState(0);

  const [randomCharacter, setRandomCharacter] = useState(null);
  const [isRandomLoading, setIsRandomLoading] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  // Shine Pokémon
  const handlePokemonMouseMove = (event) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    card.style.setProperty("--shine-x", `${x}%`);
    card.style.setProperty("--shine-y", `${y}%`);
  };

  const handlePokemonMouseLeave = (event) => {
    const card = event.currentTarget;
    card.style.setProperty("--shine-x", "50%");
    card.style.setProperty("--shine-y", "0%");
  };

  // Fond de page
  useEffect(() => {
    document.body.classList.add("bg-characters");
    document.body.classList.remove("bg-home", "bg-comics");
    return () => {
      document.body.classList.remove("bg-characters");
    };
  }, []);

  // Récupération des personnages
  useEffect(() => {
    const controller = new AbortController();

    const fetchCharacters = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const skip = (page - 1) * limit;
        const params = { skip, limit };
        if (nameParam.trim()) params.name = nameParam.trim();

        const response = await axios.get(`${API_BASE_URL}/characters`, {
          params,
          signal: controller.signal,
        });

        const payload = response.data || {};
        const results = Array.isArray(payload.results) ? payload.results : [];
        setCharacters(results);
        setResultsLength(results.length);

        const maybeTotal =
          typeof payload.total === "number"
            ? payload.total
            : typeof payload.count === "number"
            ? payload.count
            : null;

        setTotal(maybeTotal);
      } catch (err) {
        if (axios.isCancel(err)) return;
        console.error(err);
        setError("Impossible de charger les personnages.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCharacters();

    return () => controller.abort();
  }, [nameParam, page, limit]);

  // Personnage aléatoire
  const fetchRandomCharacter = async () => {
    setIsRandomLoading(true);
    setRandomCharacter(null);

    try {
      const headResp = await axios.get(`${API_BASE_URL}/characters`, {
        params: { skip: 0, limit: 1 },
      });
      const headData = headResp.data || {};
      const maybeTotal =
        typeof headData.total === "number"
          ? headData.total
          : typeof headData.count === "number"
          ? headData.count
          : null;

      if (!maybeTotal || maybeTotal <= 0) {
        setRandomCharacter(null);
        return;
      }

      if (maybeTotal <= 100) {
        const batchResp = await axios.get(`${API_BASE_URL}/characters`, {
          params: { skip: 0, limit: maybeTotal },
        });
        const items = Array.isArray(batchResp.data?.results)
          ? batchResp.data.results
          : [];
        if (items.length > 0) {
          const randomIndex = Math.floor(Math.random() * items.length);
          setRandomCharacter(items[randomIndex]);
        } else {
          setRandomCharacter(null);
        }
      } else {
        const randIndex = Math.floor(Math.random() * maybeTotal);
        const randResp = await axios.get(`${API_BASE_URL}/characters`, {
          params: { skip: randIndex, limit: 1 },
        });
        const item = Array.isArray(randResp.data?.results)
          ? randResp.data.results[0]
          : null;
        setRandomCharacter(item || null);
      }
    } catch (err) {
      console.error("Random character error", err);
      setRandomCharacter(null);
    } finally {
      setIsRandomLoading(false);
    }
  };

  // Charger une découverte automatique au montage
  useEffect(() => {
    fetchRandomCharacter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateParams = (newPage, newLimit = limit, newName = nameParam) => {
    const params = {};
    if (newName) params.name = newName;
    if (newPage && newPage > 1) params.page = String(newPage);
    if (newLimit && newLimit !== 20) params.limit = String(newLimit);
    setSearchParams(params, { replace: false });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const value = searchInput.trim();
    updateParams(1, limit, value);
  };

  const handleReset = () => {
    setSearchInput("");
    updateParams(1, limit, "");
  };

  const handleCardClick = (character) => {
    setSelectedCharacter(character);
  };

  const handleCloseDetail = () => {
    setSelectedCharacter(null);
  };

  if (isLoading) return <p className="loading">Loading characters...</p>;
  if (error) return <p className="error">Erreur: {error}</p>;
  if (!characters || characters.length === 0)
    return <p className="empty">Aucun personnage trouvé.</p>;

  return (
    <main className="page page-characters">
      <header className="page-header">
        <h1 className="page-title">Personnages Marvel</h1>

        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Rechercher un personnage..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit">Rechercher</button>
          {nameParam && (
            <button type="button" onClick={handleReset}>
              Réinitialiser
            </button>
          )}
        </form>

        {nameParam && (
          <h2 className="results-title">Résultats pour "{nameParam}"</h2>
        )}
      </header>

      {/* LISTE DES PERSONNAGES – version Pokémon */}
      <div className="cards">
        {characters.map((character) => {
          const key = character._id || character.id || character.name;
          const thumbnail = character.thumbnail || {};
          return (
            <article
              key={key}
              className="card"
              onClick={() => handleCardClick(character)}
            >
              <div className="tilt-card" data-tilt>
                {/* FRONT */}
                <div className="tilt-card-front">
                  {thumbnail.path && thumbnail.extension ? (
                    <div
                      className="pokemon-card pokemon-card--small"
                      onMouseMove={handlePokemonMouseMove}
                      onMouseLeave={handlePokemonMouseLeave}
                    >
                      <div className="pokemon-card-inner">
                        <img
                          className="pokemon-card-img"
                          src={getImageUrl(thumbnail)}
                          alt={character.name}
                        />
                      </div>
                    </div>
                  ) : null}

                  <h3 className="card-title">{character.name}</h3>
                </div>

                {/* BACK */}
                <div className="tilt-card-back">
                  {thumbnail.path && thumbnail.extension ? (
                    <div
                      className="pokemon-card pokemon-card--small"
                      onMouseMove={handlePokemonMouseMove}
                      onMouseLeave={handlePokemonMouseLeave}
                    >
                      <div className="pokemon-card-inner">
                        <img
                          className="pokemon-card-img"
                          src={getImageUrl(thumbnail)}
                          alt={character.name}
                        />
                      </div>
                    </div>
                  ) : null}

                  <h3 className="card-title card-title-back">
                    {character.name}
                  </h3>
                  {character.description?.trim() && (
                    <p className="card-desc">{character.description}</p>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* PAGINATION */}
      <Pagination
        page={page}
        limit={limit}
        total={total}
        resultsLength={resultsLength}
        onChangePage={(newPage) => updateParams(newPage, limit)}
        onChangeLimit={(newLimit) => {
          updateParams(1, newLimit);
        }}
      />

      {/* DÉCOUVERTE DU JOUR – version Pokémon */}
      <section className="daily-discovery">
        <h2 className="results-title">Découverte du jour (Personnage)</h2>
        {isRandomLoading ? (
          <p className="loading">Chargement...</p>
        ) : randomCharacter ? (
          <div className="daily-card-wrapper">
            <article className="card random-card">
              <div
                className="tilt-card"
                data-tilt
                onClick={() => handleCardClick(randomCharacter)}
              >
                <div className="tilt-card-front">
                  {randomCharacter.thumbnail?.path &&
                  randomCharacter.thumbnail?.extension ? (
                    <div
                      className="pokemon-card pokemon-card--small"
                      onMouseMove={handlePokemonMouseMove}
                      onMouseLeave={handlePokemonMouseLeave}
                    >
                      <div className="pokemon-card-inner">
                        <img
                          className="pokemon-card-img"
                          src={getImageUrl(randomCharacter.thumbnail)}
                          alt={randomCharacter.name}
                        />
                      </div>
                    </div>
                  ) : null}
                  <h3 className="card-title">{randomCharacter.name}</h3>
                </div>
                <div className="tilt-card-back">
                  {randomCharacter.thumbnail?.path &&
                  randomCharacter.thumbnail?.extension ? (
                    <div
                      className="pokemon-card pokemon-card--small"
                      onMouseMove={handlePokemonMouseMove}
                      onMouseLeave={handlePokemonMouseLeave}
                    >
                      <div className="pokemon-card-inner">
                        <img
                          className="pokemon-card-img"
                          src={getImageUrl(randomCharacter.thumbnail)}
                          alt={randomCharacter.name}
                        />
                      </div>
                    </div>
                  ) : null}
                  <h3 className="card-title card-title-back">
                    {randomCharacter.name}
                  </h3>
                  {randomCharacter.description?.trim() && (
                    <p className="card-desc">{randomCharacter.description}</p>
                  )}
                </div>
              </div>
              <button
                onClick={fetchRandomCharacter}
                className="random-button"
              >
                Découvrir quelqu’un d’autre
              </button>
            </article>
          </div>
        ) : (
          <div className="empty-random">
            <p className="empty">
              Impossible de récupérer un personnage aléatoire pour le moment.
            </p>
            <button
              onClick={fetchRandomCharacter}
              className="random-button"
            >
              Réessayer
            </button>
          </div>
        )}
      </section>

      {/* FICHE DÉTAILLÉE – carte Pokémon en grand */}
      {selectedCharacter && (
        <div className="detail-overlay" onClick={handleCloseDetail}>
          <div
            className="detail-overlay-inner"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="detail-close"
              type="button"
              onClick={handleCloseDetail}
              aria-label="Fermer la fiche détaillée"
            >
              ×
            </button>

            <div className="detail-layout">
              <div className="detail-media">
                <div className="pokemon-card-wrapper">
                  <div
                    className="pokemon-card"
                    onMouseMove={handlePokemonMouseMove}
                    onMouseLeave={handlePokemonMouseLeave}
                  >
                    <div className="pokemon-card-inner">
                      {selectedCharacter.thumbnail?.path &&
                      selectedCharacter.thumbnail?.extension ? (
                        <img
                          className="pokemon-card-img"
                          src={getImageUrl(selectedCharacter.thumbnail)}
                          alt={selectedCharacter.name}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <div className="detail-content">
                <p className="detail-meta">Personnage Marvel</p>
                <h2 className="detail-title">
                  {selectedCharacter.name || "Sans nom"}
                </h2>
                {selectedCharacter.description?.trim() && (
                  <p className="detail-desc">
                    {selectedCharacter.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Characters;
