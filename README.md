# Autour du Cacao — autourducacao.com

Site web officiel du podcast **Autour du Cacao** — le podcast qui va au-delà du chocolat.

Built with Next.js 16 + Tailwind CSS. Episodes pulled live from the Riverside RSS feed.

---

## Développement local

```bash
npm install
cp .env.example .env.local   # optionnel — analytics uniquement
npm run dev
```

Ouvrir http://localhost:3000

---

## Structure

```
app/
  page.tsx              # Homepage
  episodes/
    page.tsx            # Liste des épisodes (RSS live)
    [id]/page.tsx       # Épisode individuel + player audio
  blog/
    page.tsx            # Index articles
    [slug]/page.tsx     # Article MDX
  about/page.tsx
  dashboard/page.tsx    # Analytics interne (Plausible)
  sitemap.ts            # Sitemap auto-généré
  robots.ts

lib/
  rss.ts                # Fetches + parse le flux Riverside RSS
  posts.ts              # Loader articles MDX

content/posts/          # Articles MDX (un fichier = un article)
```

---

## Ajouter un article blog

Créer un fichier `content/posts/mon-article.mdx` :

```mdx
---
title: "Titre de l'article"
date: "2026-04-08"
author: "Autour du Cacao"
excerpt: "Une phrase de résumé."
tags: ["cacao", "valorisation"]
---

# Titre

Contenu de l'article en Markdown...
```

L'article apparaît automatiquement sur `/blog` après déploiement.

---

## Nouveaux épisodes

Rien à faire — les nouveaux épisodes publiés sur Riverside apparaissent automatiquement
sur le site dans l'heure suivante (ISR revalidation toutes les 60 min).

---

## Déploiement sur Vercel (1 fois)

1. **Push ce dossier sur GitHub**
   ```bash
   # En terminal, dans ce dossier :
   sudo xcodebuild -license   # accepter la licence Xcode (une fois)
   git init && git add -A
   git commit -m "feat: initial platform"
   # Créer un repo sur github.com, puis :
   git remote add origin https://github.com/VOTRE_ORG/autourducacao.git
   git push -u origin main
   ```

2. **Connecter Vercel**
   - Aller sur vercel.com → New Project → importer le repo GitHub
   - Framework: Next.js (auto-détecté)
   - Cliquer Deploy

3. **Configurer le domaine**
   - Dans Vercel → Project Settings → Domains → Ajouter `autourducacao.com`
   - Copier les DNS records Vercel, les mettre chez votre registrar
   - SSL auto-provisonné par Vercel

4. **Variables d'environnement** (dans Vercel → Settings → Environment Variables)
   ```
   NEXT_PUBLIC_SITE_URL=https://autourducacao.com
   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=autourducacao.com   # optionnel, analytics
   PLAUSIBLE_API_KEY=xxx                             # optionnel
   PLAUSIBLE_SITE_ID=autourducacao.com               # optionnel
   ANTHROPIC_API_KEY=xxx                             # pour le pipeline IA (AUT-3)
   ```

---

## Analytics

Dashboard interne accessible sur `/dashboard` (non indexé par les moteurs).
Alimenté par Plausible.io — fonctionne en mode stub sans credentials.
