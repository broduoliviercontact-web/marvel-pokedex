import axios from "axios";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import getImageUrl from "../utils/getImageUrl";
import Pagination from "../components/Pagination";
import "../pages/pages.css";
import { API_BASE_URL } from "../config";

const Comics = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const nameParam = searchParams.get("name") || "";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const limitParam = parseInt(searchParams.get("limit") || "100", 10);

  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const limit = Number.isNaN(limitParam) || limitParam < 1 ? 20 : limitParam;

  const [comics, setComics] = useState([]);
  const [searchInput, setSearchInput] = useState(nameParam);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(null);
  const [resultsLength, setResultsLength] = useState(0);

  const [randomComic, setRandomComic] = useState(null);
  const [isRandomLoading, setIsRandomLoading] = useState(false);
  const [selectedComic, setSelectedComic] = useState(null);

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
    document.body.classList.add("bg-comics");
    document.body.classList.remove("bg-home", "bg-characters");
    return () => {
      document.body.classList.remove("bg-comics");
    };
  }, []);

  // Récupération des comics
  useEffect(() => {
    const controller = new AbortController();

    const fetchComics = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const skip = (page - 1) * limit;
        const params = { skip, limit };
        if (nameParam.trim()) params.name = nameParam.trim();

        const response = await axios.get(`${API_BASE_URL}/comics`, {
          params,
          signal: controller.signal,
        });

        const payload = response.data || {};
        const results = Array.isArray(payload.results) ? payload.results : [];
        setComics(results);
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
        setError("Impossible de charger les comics.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchComics();

    return () => controller.abort();
  }, [nameParam, page, limit]);

  // Comic aléatoire
  const fetchRandomComic = async () => {
    setIsRandomLoading(true);
    setRandomComic(null);

    try {
      const headResp = await axios.get(`${API_BASE_URL}/comics`, {
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
        setRandomComic(null);
        return;
      }

      if (maybeTotal <= 100) {
        const batchResp = await axios.get(`${API_BASE_URL}/comics`, {
          params: { skip: 0, limit: maybeTotal },
        });
        const items = Array.isArray(batchResp.data?.results)
          ? batchResp.data.results
          : [];
        if (items.length > 0) {
          const randomIndex = Math.floor(Math.random() * items.length);
          setRandomComic(items[randomIndex]);
        } else {
          setRandomComic(null);
        }
      } else {
        const randIndex = Math.floor(Math.random() * maybeTotal);
        const randResp = await axios.get(`${API_BASE_URL}/comics`, {
          params: { skip: randIndex, limit: 1 },
        });
        const item = Array.isArray(randResp.data?.results)
          ? randResp.data.results[0]
          : null;
        setRandomComic(item || null);
      }
    } catch (err) {
      console.error("Random comic error", err);
      setRandomComic(null);
    } finally {
      setIsRandomLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomComic();
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

  const handleCardClick = (comic) => {
    setSelectedComic(comic);
  };

  const handleCloseDetail = () => {
    setSelectedComic(null);
  };

  if (isLoading) return <p className="loading">Loading comics...</p>;
  if (error) return <p className="error">Erreur: {error}</p>;
  if (!comics || comics.length === 0)
    return <p className="empty">Aucun comic trouvé.</p>;

  return (
    <main className="page page-comics">
      {/* <header className="page-header">
        <h1 className="page-title">Comics Marvel</h1>

        <form className="search-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Rechercher un comic..."
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
      </header> */}

      {/* LISTE DES COMICS – style Pokémon */}
      <div className="cards">
        {comics.map((comic) => {
          const key = comic._id || comic.id || comic.title;
          const thumbnail = comic.thumbnail || {};
          return (
            <article
              key={key}
              className="card"
              onClick={() => handleCardClick(comic)}
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
                          alt={comic.title}
                        />
                      </div>
                    </div>
                  ) : null}

                  <h3 className="card-title">{comic.title}</h3>
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
                          alt={comic.title}
                        />
                      </div>
                    </div>
                  ) : null}

                  <h3 className="card-title card-title-back">
                    {comic.title}
                  </h3>
                  <p className="card-desc">
                    {comic.description || "Pas de description"}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>



      {/* DÉCOUVERTE DU JOUR – style Pokémon */}
      <section className="daily-discovery">
  
        {isRandomLoading ? (
          <p className="loading">Chargement...</p>
        ) : randomComic ? (
          <div className="daily-card-wrapper">
            <article className="card random-card">
              <div
                className="tilt-card"
                data-tilt
                onClick={() => handleCardClick(randomComic)}
              >
                <div className="tilt-card-front">
                  {randomComic.thumbnail?.path &&
                  randomComic.thumbnail?.extension ? (
                    <div
                      className="pokemon-card pokemon-card--small"
                      onMouseMove={handlePokemonMouseMove}
                      onMouseLeave={handlePokemonMouseLeave}
                    >
                      <div className="pokemon-card-inner">
                        <img
                          className="pokemon-card-img"
                          src={getImageUrl(randomComic.thumbnail)}
                          alt={randomComic.title}
                        />
                      </div>
                    </div>
                  ) : null}
                  <h3 className="card-title">{randomComic.title}</h3>
                </div>
                <div className="tilt-card-back">
                  {randomComic.thumbnail?.path &&
                  randomComic.thumbnail?.extension ? (
                    <div
                      className="pokemon-card pokemon-card--small"
                      onMouseMove={handlePokemonMouseMove}
                      onMouseLeave={handlePokemonMouseLeave}
                    >
                      <div className="pokemon-card-inner">
                        <img
                          className="pokemon-card-img"
                          src={getImageUrl(randomComic.thumbnail)}
                          alt={randomComic.title}
                        />
                      </div>
                    </div>
                  ) : null}
                  <h3 className="card-title card-title-back">
                    {randomComic.title}
                  </h3>
                  <p className="card-desc">
                    {randomComic.description || "Pas de description"}
                  </p>
                </div>
              </div>
              <button onClick={fetchRandomComic} className="random-button">
                Découvrir un autre comic
              </button>
            </article>
          </div>
        ) : (
          <div className="empty-random">
            <p className="empty">
              Impossible de récupérer un comic aléatoire pour le moment.
            </p>
            <button onClick={fetchRandomComic} className="random-button">
              Réessayer
            </button>
          </div>
        )}
      </section>

      {/* FICHE DÉTAILLÉE – carte Pokémon en grand */}
      {selectedComic && (
        <div className="detail-overlay" onClick={handleCloseDetail}>
          <div
            className="detail-card"
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

            <div className="detail-body">
              <div className="pokemon-card-wrapper">
                <div
                  className="pokemon-card"
                  onMouseMove={handlePokemonMouseMove}
                  onMouseLeave={handlePokemonMouseLeave}
                >
                  <div className="pokemon-card-inner">
                    {selectedComic.thumbnail?.path &&
                    selectedComic.thumbnail?.extension ? (
                      <img
                        className="pokemon-card-img"
                        src={getImageUrl(selectedComic.thumbnail)}
                        alt={selectedComic.title}
                      />
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="detail-text">
                <h2 className="detail-title">{selectedComic.title}</h2>
                <p className="detail-description">
                  {selectedComic.description || "Pas de description"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
    </main>
  );
};

export default Comics;
