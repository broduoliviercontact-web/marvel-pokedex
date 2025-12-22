# Marvel Pokedex

> Une application web moderne pour parcourir, rechercher et sauvegarder vos personnages Marvel favoris. Interface réactive, recherche, pagination et gestion des favoris — tout ce qu'il faut pour naviguer l'univers Marvel.

---

[![status](https://img.shields.io/badge/status-ready-brightgreen)](#) [![license](https://img.shields.io/badge/license-MIT-blue)](#) [![made with](https://img.shields.io/badge/made%20with-React%20%7C%20Next.js-blueviolet)](#)

Attention : remplacez les badges ci‑dessous par vos liens CI / coverage / deploy réels si vous en avez.

Table des matières
- Description
- Démo & captures (GIF)
- Fonctionnalités
- Stack technique
- Prérequis
- Installation & démarrage
- Variables d'environnement
- Exemple d'utilisation de l'API Marvel
- Tests & linting
- Déploiement
- Bonnes pratiques (caching, throttling)
- Contribuer
- Licence
- Contact

---

Description
---
Marvel Pokedex est une application web qui consomme l'API publique Marvel pour afficher les personnages, leurs comics et informations associées. Elle propose recherche, filtres, pagination et un système de favoris local (ou connecté selon l'implémentation).

Démo & captures (GIF)
---
Vous pouvez insérer des GIFs de démonstration dans le dossier `/assets` (ou les héberger) et les référencer ici.

Exemples :
- Aperçu de la liste : `![Liste personnages](./assets/list-demo.gif)`
- Recherche / filtrage : `![Recherche](./assets/search-demo.gif)`
- Détails personnage : `![Détails](./assets/details-demo.gif)`

Fonctionnalités
---
- Liste paginée des personnages Marvel
- Recherche en texte libre (nom / début du nom)
- Filtres (ex: comics disponibles, séries)
- Page détail avec image, description et comics listés
- Favoris (localStorage / backend optionnel)
- Responsive & accessible (mobile / tablette / desktop)
- Gestion basique des erreurs et états de chargement

Stack technique (suggestion)
---
- Framework : React (ou Next.js)
- Langage : TypeScript (recommandé)
- Styles : Tailwind CSS / CSS Modules / Styled Components
- Tests : Jest + React Testing Library
- Outils : eslint, prettier
- Déploiement : Vercel / Netlify / Cloud (Docker optionnel)

Prérequis
---
- Node.js >= 18
- npm, Yarn ou pnpm
- Clé API Marvel (public + private) — inscription sur https://developer.marvel.com/

Installation & démarrage
---
Cloner le repo et installer les dépendances :

- Avec npm
```bash
git clone https://github.com/<votre-org>/<marvel-pokedex>.git
cd marvel-pokedex
npm install
npm run dev
```

- Avec Yarn
```bash
yarn
yarn dev
```

- Avec pnpm
```bash
pnpm install
pnpm dev
```

Build pour la production :
```bash
npm run build
npm run start
# ou
yarn build
yarn start
```

Variables d'environnement
---
Créez un fichier `.env.local` (ou `.env`) à la racine. Exemple `.env.example` :

```env
# Clés Marvel (NE PAS COMMITTER LES CLÉS PRIVÉES)
MARVEL_PUBLIC_KEY=your_public_key
MARVEL_PRIVATE_KEY=your_private_key

# Si vous utilisez Next.js ou voulez exposer la clé publique côté client
NEXT_PUBLIC_MARVEL_PUBLIC_KEY=your_public_key

# Optionnel : URL de l'API backend si vous passez par un serveur proxy
API_BASE_URL=http://localhost:3000/api
```

Important : Ne comitez pas vos clés privées. Stockez les en variables d'environnement côté serveur ou via le service de secrets de votre plateforme de déploiement.

Exemple d'utilisation de l'API Marvel
---
L'API Marvel demande une signature MD5 : hash = md5(ts + privateKey + publicKey). Voici un exemple minimal côté serveur (Node.js) :

```js
import crypto from 'crypto';

function marvelAuthQuery(ts, publicKey, privateKey) {
  const hash = crypto.createHash('md5').update(ts + privateKey + publicKey).digest('hex');
  return `ts=${ts}&apikey=${publicKey}&hash=${hash}`;
}

// Exemple d'appel pour récupérer des personnages
const ts = Date.now().toString();
const q = marvelAuthQuery(ts, process.env.MARVEL_PUBLIC_KEY, process.env.MARVEL_PRIVATE_KEY);
const url = `https://gateway.marvel.com/v1/public/characters?limit=20&${q}`;
```

Conseils :
- Faites les requêtes côté serveur (API route / proxy) pour protéger la clé privée.
- Respectez les limitations de l'API (rate limits).
- Implémentez un cache côté serveur (Redis / in-memory / CDN).

Tests & linting
---
Scripts recommandés (ajoutez-les dans package.json si nécessaire) :
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext .js,.jsx,.ts,.tsx",
    "format": "prettier --write .",
    "test": "jest --passWithNoTests"
  }
}
```

Déploiement
---
- Vercel : branche main/deploy automatique ; ajoutez vos variables d'environnement dans le dashboard.
- Netlify : build command `npm run build`, publish folder `out` (si Next.js static) ou `.next` selon configuration.
- Docker : fournissez un Dockerfile (optionnel) pour conteneuriser l'app.

Bonnes pratiques (caching, throttling)
---
- Cacher les réponses les plus demandées (Redis ou CDN).
- Limiter la fréquence des recherches côté client (debounce).
- Paginer les résultats pour éviter de charger trop d'éléments.
- Mettre en place un fallback UX quand l'API rate-limit.

Contribuer
---
Contributions bienvenues — forkez, créez une branche feature/bugfix puis ouvrez une PR. Exemple de workflow :

1. Fork
2. git checkout -b feat/ma-fonctionnalite
3. Commit & push
4. Ouvrir une Pull Request avec description et captures

Guidelines :
- Respecter le linter et la configuration prettier
- Ajouter des tests pour les nouvelles fonctions critiques
- Documenter les changements importants dans le changelog

Modèle de message de commit (conventionnel recommandé) :
- feat: ajout de la recherche par nom
- fix: correction du rendu mobile
- docs: mise à jour du README

Licence
---
MIT © VotreNom ou Organisation — modifiez si nécessaire.

Contact
---
Pour toute question : broduoliviercontact-web (GitHub) — ou placez votre e‑mail/profil public.

Remerciements
---
- Marvel Developer Portal — pour les données
- Bibliothèques open source utilisées

---

Astuce — insertion de GIFs et images
---
Placez vos GIFs dans `/assets` et utilisez-les ainsi :
```md
![Aperçu liste](./assets/list-demo.gif)
![Recherche](./assets/search-demo.gif)
```
Si vous voulez un rendu centré et de taille contrôlée, utilisez HTML dans le markdown :
```html
<p align="center">
  <img src="./assets/list-demo.gif" alt="Liste personnages" width="800" />
</p>
```

Besoin d'aide ?
---
Souhaitez‑vous que je :
- Génère un `.env.example` prêt à l'emploi ?
- Ajoute un template de CONTRIBUTING.md ?
- Crée un small CI workflow (GitHub Actions) pour tests & lint ?

Dites‑moi ce que vous préférez et j'ajuste le README ou je génère les fichiers manquants.
