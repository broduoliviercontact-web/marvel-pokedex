import { useEffect, useMemo, useState } from "react";
import { loadFavorites, toggleFavorite } from "../utils/favorites";
import { loadComicFavorites, toggleComicFavorite } from "../utils/favoritesComics";
import getImageUrl from "../utils/getImageUrl";
import "../pages/pages.css";

// (optionnel) si tu veux le shine/tilt sur l’image comme ailleurs
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
  const [comicFavorites, setComicFavorites] = useState(() => loadComicFavorites());

  const heroIds = useMemo(() => new Set(heroFavorites.map((x) => x.id)), [heroFavorites]);
  const comicIds = useMemo(() => new Set(comicFavorites.map((x) => x.id)), [comicFavorites]);

  const removeHero = (fav) => {
    const next = toggleFavorite({ id: fav.id, name: fav.name, thumbnail: fav.thumbnail });
    setHeroFavorites(next);
  };

  const removeComic = (fav) => {
    const next = toggleComicFavorite({ id: fav.id, title: fav.title, thumbnail: fav.thumbnail });
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
      <h1 className="page-title">Favorites</h1>

      {/* HEROES */}
      {heroFavorites.length > 0 && (
        <>
          <h2 className="page-title" style={{ marginTop: 16 }}>Heroes</h2>

          <div className="cards">
            {heroFavorites.map((fav) => {
              const thumbnail = fav.thumbnail || {};
              const isFav = heroIds.has(fav.id);

              const FavButton = (
                <button
                  type="button"
                  className={"random-button fav-btn" + (isFav ? " fav-btn--active" : "")}
                  aria-label="Retirer des favoris"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeHero(fav);
                  }}
                >
                  ❤️
                </button>
              );

              return (
                <article key={fav.id} className="card">
                  <div className="tilt-card" data-tilt>
                    <div className="tilt-card-front">
                      {FavButton}

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

                    <div className="tilt-card-back">
                      {FavButton}
                      <h3 className="card-title card-title-back">{fav.name}</h3>
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
          <h2 className="page-title" style={{ marginTop: 24 }}>Comics</h2>

          <div className="cards">
            {comicFavorites.map((fav) => {
              const thumbnail = fav.thumbnail || {};
              const isFav = comicIds.has(fav.id);

              const FavButton = (
                <button
                  type="button"
                  className={"random-button fav-btn" + (isFav ? " fav-btn--active" : "")}
                  aria-label="Retirer des favoris"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeComic(fav);
                  }}
                >
                  ❤️
                </button>
              );

              return (
                <article key={fav.id} className="card">
                  <div className="tilt-card" data-tilt>
                    <div className="tilt-card-front">
                      {FavButton}

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

                    <div className="tilt-card-back">
                      {FavButton}
                      <h3 className="card-title card-title-back">{fav.title}</h3>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </main>
  );
}
