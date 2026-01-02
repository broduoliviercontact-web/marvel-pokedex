// src/utils/favorites.js
const KEY = "favoriteHeroes_v1";

export function loadFavorites() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveFavorites(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function isFavorite(id) {
  return loadFavorites().some((x) => x.id === id);
}

export function toggleFavorite(hero) {
  const list = loadFavorites();
  const exists = list.some((x) => x.id === hero.id);

  const next = exists
    ? list.filter((x) => x.id !== hero.id)
    : [{ id: hero.id, name: hero.name, thumbnail: hero.thumbnail }, ...list];

  saveFavorites(next);
  return next;
}
