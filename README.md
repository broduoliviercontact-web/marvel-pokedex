# Marvel Pokédex (Marvel Explorer)

Application web pour explorer l’univers Marvel : **liste de personnages**, **recherche**, **pagination** et **favoris**.

**Démo :** https://marvel-exploreur.netlify.app/

---

## ✨ Fonctionnalités

- Parcours des personnages Marvel
- Recherche (par nom / début du nom)
- Pagination
- Fiche personnage (infos + visuel)
- Favoris (stockage local)

> ℹ️ L’API Marvel renvoie un champ `attributionText` / `attributionHTML` (ex: “Data provided by Marvel…”) qui doit être affiché lors de l’utilisation des données. :contentReference[oaicite:2]{index=2}

---

## 🧱 Stack

- Front : **React + Vite** :contentReference[oaicite:3]{index=3}  
- Qualité : **ESLint** :contentReference[oaicite:4]{index=4}  
- Package manager : **Yarn** (repo fourni avec `yarn.lock`) :contentReference[oaicite:5]{index=5}  
- Déploiement : **Netlify** (démo en ligne)

---

## ✅ Prérequis

- Node.js **18+**
- Yarn
- Clés API Marvel (public + private) : https://developer.marvel.com/ :contentReference[oaicite:6]{index=6}

---

## 🚀 Installation & lancement

```bash
git clone https://github.com/broduoliviercontact-web/marvel-pokedex.git
cd marvel-pokedex
yarn
yarn dev
Build + preview :

bash
Copier le code
yarn build
yarn preview
Lint :

bash
Copier le code
yarn lint
🔐 Variables d’environnement
Option A — Démo / apprentissage (clé privée côté client ⚠️)
Si tu génères le hash Marvel côté client, la clé privée peut fuiter en prod.

Crée un .env à la racine :

env
Copier le code
VITE_MARVEL_PUBLIC_KEY=xxxxx
VITE_MARVEL_PRIVATE_KEY=xxxxx
Option B — Recommandé en production (proxy backend)
En prod, fais la signature (MD5) côté serveur (Netlify Functions, Vercel Functions, Express, etc.) :

Front appelle /api/marvel/characters?...

Le serveur ajoute ts, apikey, hash puis appelle gateway.marvel.com

📁 Structure du projet
txt
Copier le code
public/
src/
eslint.config.js
vite.config.js
yarn.lock
GitHub

🧾 Crédit / Attribution Marvel
Quand tu affiches des données issues de l’API Marvel, tu dois afficher l’attribution recommandée (souvent fournie directement dans la réponse via attributionText / attributionHTML). 
Gist
+1

📄 Licence
À compléter (ajoute un fichier LICENSE si tu veux open-sourcer proprement : MIT, Apache-2.0, etc.).

👤 Auteur
Olivier — https://github.com/broduoliviercontact-web
