import axios from "axios";
import { useState, useEffect } from "react";
import getImageUrl from "../utils/getImageUrl";
import "../pages/pages.css";
import { API_BASE_URL } from "../config";
import marvelLogo2 from "/public/Marvel_Logo.svg";

const Home = () => {
  // Découverte du jour – personnage
  const [randomCharacter, setRandomCharacter] = useState(null);
  const [isRandomCharacterLoading, setIsRandomCharacterLoading] =
    useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  // Découverte du jour – comic
  const [randomComic, setRandomComic] = useState(null);
  const [isRandomComicLoading, setIsRandomComicLoading] = useState(false);
  const [selectedComic, setSelectedComic] = useState(null);

  // Effet holo + tilt
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

  // Fond : Home
  useEffect(() => {
    document.body.classList.add("bg-home");
    document.body.classList.remove("bg-characters", "bg-comics");
    return () => {
      document.body.classList.remove("bg-home");
    };
  }, []);

  // Fetch random character
  const fetchRandomCharacter = async () => {
    setIsRandomCharacterLoading(true);
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
      setIsRandomCharacterLoading(false);
    }
  };

  // Fetch random comic
  const fetchRandomComic = async () => {
    setIsRandomComicLoading(true);
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
      setIsRandomComicLoading(false);
    }
  };

  // Charger les 2 au montage
  useEffect(() => {
    fetchRandomCharacter();
    fetchRandomComic();
  }, []);

  const handleCharacterClick = (character) => setSelectedCharacter(character);
  const handleComicClick = (comic) => setSelectedComic(comic);
  const closeCharacterDetail = () => setSelectedCharacter(null);
  const closeComicDetail = () => setSelectedComic(null);

  return (
    
    <main className="page page-home">
      
<header className="home-hero">
  <div className="home-hero-left">
    <div className="home-hero-logo">
    <img src={marvelLogo2} alt="Marvel logo" className="home-hero-logo-img" />
    </div>

    <div className="home-hero-text">
  
      <h1 className="home-hero-title">
        EXPLORER 

      </h1>
      <p className="home-hero-subtitle">
        An unofficial Marvel database 
      </p>
      
    </div>
  </div>

  <div className="home-hero-right">
  
  </div>
</header>

      <section className="daily-discovery">
        <div className="daily-row">

           {/* Daily comic 1 */}
          <div className="daily-card-wrapper">
            {isRandomComicLoading ? (
              <p className="loading">Chargement...</p>
            ) : randomComic ? (
              <article className="card random-card">
                <div
                  className="tilt-card"
                  data-tilt
                  onClick={() => handleComicClick(randomComic)}
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
                  Random Comics
                </button>
              </article>
            ) : (
              <div className="empty-random">
                <p className="empty">
                  Impossible de récupérer un comic aléatoire.
                </p>
                <button onClick={fetchRandomComic} className="random-button">
                  Réessayer
                </button>
              </div>
            )}
          </div>
          {/* Daily character */}
          <div className="daily-card-wrapper">
            {isRandomCharacterLoading ? (
              <p className="loading">Chargement...</p>
            ) : randomCharacter ? (
              <article className="card random-card">
                <div
                  className="tilt-card"
                  data-tilt
                  onClick={() => handleCharacterClick(randomCharacter)}
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
                      <p className="card-desc">
                        {randomCharacter.description}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={fetchRandomCharacter}
                  className="random-button"
                >
                  Random Heroes
                </button>
              </article>
            ) : (
              <div className="empty-random">
                <p className="empty">
                  Impossible de récupérer un personnage aléatoire.
                </p>
                <button
                  onClick={fetchRandomCharacter}
                  className="random-button"
                >
                  Réessayer
                </button>
              </div>
            )}
          </div>

         
        </div>
      </section>

      {selectedCharacter && (
        <div className="detail-overlay" onClick={closeCharacterDetail}>
          <div
            className="detail-overlay-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="detail-close"
              onClick={closeCharacterDetail}
            >
              ×
            </button>
            <div className="detail-layout">
              <div className="detail-media">
                <div className="pokemon-card-wrapper">
                  <div
                    className="pokemon-card pokemon-card--holo"
                    onMouseMove={handlePokemonMouseMove}
                    onMouseLeave={handlePokemonMouseLeave}
                  >
                    <div className="pokemon-card-inner">
                      {selectedCharacter.thumbnail?.path &&
                        selectedCharacter.thumbnail?.extension && (
                          <img
                            className="pokemon-card-img"
                            src={getImageUrl(selectedCharacter.thumbnail)}
                            alt={selectedCharacter.name}
                          />
                        )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="detail-content">
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

      {selectedComic && (
        <div className="detail-overlay" onClick={closeComicDetail}>
          <div
            className="detail-overlay-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="detail-close"
              onClick={closeComicDetail}
            >
              ×
            </button>
            <div className="detail-layout">
              <div className="detail-media">
                <div className="pokemon-card-wrapper">
                  <div
                    className="pokemon-card pokemon-card--holo"
                    onMouseMove={handlePokemonMouseMove}
                    onMouseLeave={handlePokemonMouseLeave}
                  >
                    <div className="pokemon-card-inner">
                      {selectedComic.thumbnail?.path &&
                        selectedComic.thumbnail?.extension && (
                          <img
                            className="pokemon-card-img"
                            src={getImageUrl(selectedComic.thumbnail)}
                            alt={selectedComic.title}
                          />
                        )}
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
    </main>
  );
};

export default Home;
