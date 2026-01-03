import { useEffect, useMemo, useState } from "react";
import { loadFavorites, toggleFavorite } from "../utils/favorites";
import {
  loadComicFavorites,
  toggleComicFavorite,
} from "../utils/favoritesComics";
import getImageUrl from "../utils/getImageUrl";
import "../pages/pages.css";

// Shine + tilt Pokémon (même logique)
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

export default function Favorites() {
  const [heroFavorites, setHeroFavorites] = useState(() => loadFavorites());
  const [comicFavorites, setComicFavorites] = useState(() =>
    loadComicFavorites()
  );

  const heroIds = useMemo(
    () => new Set(heroFavorites.map((x) => x.id)),
    [heroFavorites]
  );
  const comicIds = useMemo(
    () => new Set(comicFavorites.map((x) => x.id)),
    [comicFavorites]
  );

  // Modal (héros ou comic)
  const [selected, setSelected] = useState(null);

  // ✅ cache la navbar quand la modal est ouverte
  useEffect(() => {
    if (selected) document.body.classList.add("modal-open");
    else document.body.classList.remove("modal-open");

    return () => document.body.classList.remove("modal-open");
  }, [selected]);

  const closeDetail = () => setSelected(null);

  const removeHero = (fav) => {
    const next = toggleFavorite({
      id: fav.id,
      name: fav.name,
      thumbnail: fav.thumbnail,
      description: fav.description,
    });
    setHeroFavorites(next);
  };

  const removeComic = (fav) => {
    const next = toggleComicFavorite({
      id: fav.id,
      title: fav.title,
      thumbnail: fav.thumbnail,
      description: fav.description,
    });
    setComicFavorites(next);
  };

  const isEmpty = heroFavorites.length === 0 && comicFavorites.length === 0;

  if (isEmpty) {
    return (
      <main className="page page-characters">
        <h1 className="page-title">Favorites</h1>
        <p className="empty">Aucun favori pour le moment 🤍</p>
      </main>
    );
  }

  return (
    <main className="page page-characters">
   

      {/* HEROES */}
      {heroFavorites.length > 0 && (
        <>
          <h2 className="page-title" style={{ marginTop: 16 }}>
            Heroes
          </h2>

          <div className="cards">
            {heroFavorites.map((fav) => {
              const thumbnail = fav.thumbnail || {};
              const isFav = heroIds.has(fav.id);

              return (
                <article
                  key={fav.id}
                  className="card"
                  onClick={() =>
                    setSelected({
                      type: "hero",
                      data: fav,
                    })
                  }
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
                              alt={fav.name}
                            />
                          </div>
                        </div>
                      ) : null}

                      <h3 className="card-title">{fav.name}</h3>
                    </div>

                    {/* BACK */}
                    <div className="tilt-card-back">
                      <button
                        type="button"
                        className={
                          "random-button fav-btn" +
                          (isFav ? " fav-btn--active" : "")
                        }
                        aria-label="Retirer des favoris"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeHero(fav);
                        }}
                      >
                        ❤️
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
                              alt={fav.name}
                            />
                          </div>
                        </div>
                      ) : null}

                      <h3 className="card-title card-title-back">{fav.name}</h3>

                      {fav.description?.trim() && (
                        <p className="card-desc">{fav.description}</p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      {/* COMICS */}
      {comicFavorites.length > 0 && (
        <>
          <h2 className="page-title" style={{ marginTop: 24 }}>
            Comics
          </h2>

          <div className="cards">
            {comicFavorites.map((fav) => {
              const thumbnail = fav.thumbnail || {};
              const isFav = comicIds.has(fav.id);

              return (
                <article
                  key={fav.id}
                  className="card"
                  onClick={() =>
                    setSelected({
                      type: "comic",
                      data: fav,
                    })
                  }
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
                              alt={fav.title}
                            />
                          </div>
                        </div>
                      ) : null}

                      <h3 className="card-title">{fav.title}</h3>
                    </div>

                    {/* BACK */}
                    <div className="tilt-card-back">
                      <button
                        type="button"
                        className={
                          "random-button fav-btn" +
                          (isFav ? " fav-btn--active" : "")
                        }
                        aria-label="Retirer des favoris"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeComic(fav);
                        }}
                      >
                        ❤️
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
                              alt={fav.title}
                            />
                          </div>
                        </div>
                      ) : null}

                      <h3 className="card-title card-title-back">{fav.title}</h3>

                      {fav.description?.trim() && (
                        <p className="card-desc">{fav.description}</p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      {/* MODAL */}
      {selected && (
        <div className="detail-overlay" onClick={closeDetail}>
          <div
            className="detail-overlay-inner"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="detail-close"
              type="button"
              onClick={closeDetail}
              aria-label="Fermer"
            >
              ×
            </button>

            <div className="detail-layout">
              <div className="detail-media holo-enabled">
                <div className="pokemon-card-wrapper">
                  <div
                    className="pokemon-card pokemon-card--holo card card--swsh card--holo"
                    onMouseMove={handlePokemonMouseMove}
                    onMouseLeave={handlePokemonMouseLeave}
                  >
                    <div className="pokemon-card-inner">
                      {selected.data?.thumbnail?.path &&
                      selected.data?.thumbnail?.extension ? (
                        <img
                          className="pokemon-card-img"
                          src={getImageUrl(selected.data.thumbnail)}
                          alt={selected.type === "hero" ? selected.data.name : selected.data.title}
                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              <div className="detail-content">
                <h2 className="detail-title">
                  {selected.type === "hero" ? selected.data.name : selected.data.title}
                </h2>
                {selected.data?.description?.trim() && (
                  <p className="detail-desc">{selected.data.description}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
