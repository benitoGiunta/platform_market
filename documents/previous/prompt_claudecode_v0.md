# Prompt Claude Code — V0 Vidéastes & Shootings
**À coller dans Claude Code au lancement du projet**

---

## Prompt

```
Tu vas développer une application web appelée platform_market.

Voici le document de requirements complet pour la V0 :

[COLLE ICI LE CONTENU COMPLET DU FICHIER v0_videaste_shootings.md]

Respecte ce document à la lettre et travaille phase par phase dans l'ordre suivant :

Phase 1 — Structure & Configuration
Phase 2 — Backend & Base de données
Phase 3 — Frontend
Phase 4 — Validation finale & Git

Pour chaque phase :
- Dis-moi ce que tu fais avant de le faire
- Donne-moi les commandes exactes à lancer pour valider
- Attends ma confirmation avant de passer à la phase suivante

Commence par la Phase 1.
```

---

## Notes

- Remplacer `[COLLE ICI LE CONTENU COMPLET DU FICHIER v0_videaste_shootings.md]` par le contenu brut du fichier `v0_videaste_shootings.md`
- Lancer Claude Code depuis `C:\dev\kyn\platform_market`
- Copier les logos dans `frontend/public/` après que Claude Code ait créé la structure (Phase 1) :
  - `logo-app-no-background.png` → favicon / petit logo de l'app
  - `logo-full-main-no-slogan-no-background.png` → logo principal dans le header
  - `logo-full-slogan-no-background.png` → logo page home si besoin
- Renseigner le fichier `.env` avec les vraies valeurs après sa création :
  - `DATABASE_URL=postgresql://postgres:TON_MOT_DE_PASSE@localhost:5432/platform_market`
  - `PORT=3001`
  - `VITE_API_URL=http://localhost:3001`
```
