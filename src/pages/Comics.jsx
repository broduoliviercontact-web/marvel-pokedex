import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import getImageUrl from "../utils/getImageUrl";
import Pagination from "../components/Pagination";
import "../pages/pages.css";
import { API_BASE_URL } from "../config";
import {
  loadComicFavorites,
  toggleComicFavorite,
} from "../utils/favoritesComics";
import useGyroTilt from "../utils/useGyroTilt";

// Même effet holo + 3D que Home
const handlePokemonMouseMove = (event) => {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();

  const x = (event.clientX - rect.left) / rect.width;
  const y = (event.clientY - rect.top) / rect.height;

  card.style.setProperty("--shine-x", `${x * 100}%`);
  card.style.setProperty("--shine-y", `${y * 100}%`);

  const tiltX = (0.5 - y) * 18;
  const tiltY = (x - 0.5) * 18;

  card.style.setProperty("--tilt-x", `${tiltX}deg`);
  card.style.setProperty("--tilt-y", `${tiltY}deg`);
};

const handlePokemonMouseLeave = (event) => {
  const card = event.currentTarget;
  card.style.setProperty("--shine-x", "50%");
  card.style.setProperty("--shine-y", "0%");
  card.style.setProperty("--tilt-x", "0deg");
  card.style.setProperty("--tilt-y", "0deg");
};

const Comics = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const nameParam = searchParams.get("title") || "";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const limitParam = parseInt(searchParams.get("limit") || "20", 10);

  const page = Number.isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;
  const limit = Number.isNaN(limitParam) || limitParam < 1 ? 20 : limitParam;

  const [comics, setComics] = useState([]);
  const [searchInput, setSearchInput] = useState(nameParam);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(null);
  const [resultsLength, setResultsLength] = useState(0);

  const [favoriteComicIds, setFavoriteComicIds] = useState(() => {
    return new Set(loadComicFavorites().map((x) => x.id));
  });

  const [randomComic, setRandomComic] = useState(null);
  const [isRandomLoading, setIsRandomLoading] = useState(false);
  const [selectedComic, setSelectedComic] = useState(null);

  // ✅ Gyro tilt sur la carte holo de la modal
  const holoRef = useRef(null);
  const { requestPermission } = useGyroTilt(holoRef, !!selectedComic);

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
        if (nameParam.trim()) params.title = nameParam.trim();

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

  // Charger une découverte automatique au montage
  useEffect(() => {
    fetchRandomComic();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateParams = (newPage, newLimit = limit, newTitle = nameParam) => {
    const params = {};
    if (newTitle) params.title = newTitle;
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
      {/* Barre de recherche */}
      <form className="search-form" onSubmit={handleSubmit}>
        <input
          className="search-input"
          type="text"
          placeholder="Rechercher un comic..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button className="search-button" type="submit">
          Search
        </button>
        <button
          className="search-button secondary"
          type="button"
          onClick={handleReset}
        >
          Reset
        </button>
      </form>

      {/* LISTE DES COMICS – style Pokémon */}
      <div className="cards">
        {comics.map((comic) => {
          const id = comic._id || comic.id || comic.title;
          const fav = favoriteComicIds.has(id);

          const key = id;
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
                  <button
                    type="button"
                    className={
                      "random-button fav-btn" + (fav ? " fav-btn--active" : "")
                    }
                    aria-label={
                      fav ? "Retirer des favoris" : "Ajouter aux favoris"
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      const next = toggleComicFavorite({
                        id,
                        title: comic.title,
                        thumbnail: comic.thumbnail,
                        description: comic.description,
                      });
                      setFavoriteComicIds(new Set(next.map((x) => x.id)));
                    }}
                  >
                    {fav ? "❤️" : "🤍"}
                  </button>

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

                  <h3 className="card-title card-title-back">{comic.title}</h3>
                  {comic.description?.trim() && (
                    <p className="card-desc">{comic.description}</p>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* DÉCOUVERTE DU JOUR */}
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
                  {randomComic.description?.trim() && (
                    <p className="card-desc">{randomComic.description}</p>
                  )}
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

      {/* FICHE DÉTAILLÉE */}
      {selectedComic && (
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
              <div className="detail-media holo-enabled">
                <div className="pokemon-card-wrapper">
                  <div
                    ref={holoRef}
                    className="pokemon-card pokemon-card--holo card card--swsh card--holo"
                    onMouseMove={handlePokemonMouseMove}
                    onMouseLeave={handlePokemonMouseLeave}
                    onPointerDown={requestPermission}
                    onTouchStart={requestPermission}
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
              </div>

              <div className="detail-content">
                <h2 className="detail-title">
                  {selectedComic.title || "Sans titre"}
                </h2>
                {selectedComic.description?.trim() && (
                  <p className="detail-desc">{selectedComic.description}</p>
                )}
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
