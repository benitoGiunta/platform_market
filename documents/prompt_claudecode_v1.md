# Prompt Claude Code — V1 Markyn CRUD complet
**À coller dans Claude Code pour démarrer la V1**

---

## Prompt

```
Tu vas étendre l'application Markyn (platform_market) en développant la V1.

La V0 est déjà en place sur la branch main — elle contient deux écrans (liste vidéastes et détail vidéaste) avec un backend Node.js/Express, PostgreSQL/Prisma, et un frontend React/TypeScript/Tailwind.

Voici le document de requirements complet pour la V1 :

[COLLE ICI LE CONTENU COMPLET DU FICHIER v1_requirements.md]

---

INSTRUCTIONS GÉNÉRALES — à respecter impérativement :

1. BRANCH GIT
   - Avant toute modification, créer et basculer sur une nouvelle branch :
     git checkout -b feature/v1
   - Tout le travail V1 se fait sur cette branch. Ne jamais toucher à main.

2. LECTURE DU CODE EXISTANT
   - Avant de commencer la Phase 1, lire l'intégralité du code existant (backend/, frontend/, prisma/) pour comprendre la structure V0 en place.
   - Signaler tout écart entre le code V0 existant et ce que le doc V1 suppose comme point de départ.

3. TRAVAIL PHASE PAR PHASE
   - Travailler dans l'ordre strict des 9 phases du document.
   - Pour chaque phase :
     a. Annoncer ce que tu vas faire
     b. Cocher chaque item de la checklist au fur et à mesure
     c. Donner les commandes exactes à lancer pour valider (séparées, pas de &&)
     d. Attendre ma confirmation explicite avant de passer à la phase suivante

4. COMMITS
   - Faire un commit à la fin de chaque phase avec le message indiqué dans la checklist
   - Format : git add . puis git commit -m "message"
   - Ne jamais commiter .env ou node_modules

5. README
   - Mettre à jour README.md en Phase 9 avec : description de Markyn, stack technique, commandes de lancement (backend + frontend), variables d'env requises

6. MERGE — NE PAS FAIRE
   - En Phase 9, NE PAS merger feature/v1 dans main
   - Fournir uniquement les commandes à exécuter manuellement :
     git checkout main
     git merge feature/v1
     git push origin main
   - Expliquer ce que ces commandes font et attendre que je les exécute moi-même

7. POWERSHELL
   - Les commandes doivent être compatibles PowerShell Windows
   - Toujours séparer les commandes (pas de &&) — les donner ligne par ligne

Commence par créer la branch feature/v1, puis lis le code existant et signale ce que tu observes avant de démarrer la Phase 1.
```

---

## Notes avant de lancer

- Remplacer `[COLLE ICI LE CONTENU COMPLET DU FICHIER v1_requirements.md]` par le contenu brut du fichier `v1_requirements.md`
- Lancer Claude Code depuis `C:\dev\kyn\platform_market`
- S'assurer que la V0 est bien commitée et pushée sur `main` avant de lancer
- Renseigner le `.env` avec les nouvelles variables après la Phase 2 :
  - `CORS_ORIGIN=http://localhost:5173`
  - `SEED_SECRET=une_cle_secrete_longue_et_aleatoire`
  - `VITE_SEED_KEY=une_cle_secrete_longue_et_aleatoire` (même valeur que SEED_SECRET)

## Commandes de lancement en local (rappel)

```bash
# Terminal 1 — Backend
cd C:\dev\kyn\platform_market\backend
npm run dev

# Terminal 2 — Frontend
cd C:\dev\kyn\platform_market\frontend
npm run dev
```

## Commande de merge à exécuter manuellement après validation Phase 9

```bash
git checkout main
git merge feature/v1
git push origin main
```
