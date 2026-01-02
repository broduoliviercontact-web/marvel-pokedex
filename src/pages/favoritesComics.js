const KEY = "favoriteComics_v1";

export function loadComicFavorites() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveComicFavorites(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function toggleComicFavorite(comic) {
  const list = loadComicFavorites();
  const exists = list.some((x) => x.id === comic.id);

  const next = exists
    ? list.filter((x) => x.id !== comic.id)
    : [
        {
          id: comic.id,
          title: comic.title,
          thumbnail: comic.thumbnail,
          description: comic.description || "",
        },
        ...list,
      ];

  saveComicFavorites(next);
  return next;
}
