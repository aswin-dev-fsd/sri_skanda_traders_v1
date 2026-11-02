# Deploying to Vercel

The site is a static Astro build. Vercel builds it from GitHub on every push.

| Branch / event | Vercel environment | URL |
|---|---|---|
| Push to `main` | Production | `sri-skanda-traders-v1.vercel.app` (or your domain once added) |
| Push to any other branch, or a pull request | Preview | A unique `*.vercel.app` URL per deploy |

## 1. Import the project (one time)

1. Sign in at [vercel.com](https://vercel.com) with GitHub.
2. **Add New… → Project**, then import `aswin-dev-fsd/sri_skanda_traders_v1`.
3. Check the settings Vercel detects:

   | Setting | Value |
   |---|---|
   | Framework Preset | Astro |
   | Root Directory | `./` |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Install Command | `npm install` |
   | Node.js Version | 24.x (also pinned in `package.json` → `engines`) |

4. Leave **Environment Variables** empty for now, and click **Deploy**.

No adapter is needed: the site is fully static (`output: 'static'`).

## 2. Day-to-day

- Push to `main`: the production URL updates in about a minute.
- To share work before it goes to `main`, push a feature branch. Vercel comments the preview URL on the pull request.
- Build logs: **Project → Deployments → (deploy) → Build Logs**.
- Roll back: **Deployments → (an older deploy) → ⋯ → Promote to Production**.

## 3. The launch check

`npm run build` runs `scripts/check-launch.mjs` first. It lists every placeholder business detail in `src/config/site.ts` and every temporary image under `src/assets/_temp/`.

- **Before launch:** it only prints a warning, and the build continues.
- **At launch:** add the environment variable `LAUNCH_CHECK` = `strict` in **Settings → Environment Variables**, scoped to **Production** only. From then on, a production deploy fails if any placeholder or temporary image is left. Preview deploys still build.
- Locally, `npm run check:launch` runs the strict check.

## 4. Connect the domain (when it is known)

1. **Project → Settings → Domains → Add**, and enter the domain (e.g. `sriskandatraders.in`). Add the `www.` version too; Vercel offers to redirect one to the other.
2. Vercel shows the DNS records to create. At the domain registrar, add exactly what it shows. Usually:
   - apex domain: an `A` record pointing to Vercel's IP,
   - `www`: a `CNAME` pointing to Vercel's DNS name.
3. Wait for the domain to show **Valid Configuration**. HTTPS certificates are issued automatically.
4. Set `site` in `astro.config.mjs` to the final URL (e.g. `https://sriskandatraders.in`) and push. Canonical URLs and the sitemap depend on it.

## 5. Before launch

- [ ] Move the project to **Vercel Pro**. The free Hobby plan is for non-commercial use only.
- [ ] Fill every placeholder in `src/config/site.ts` and replace every image in `src/assets/_temp/`.
- [ ] Set `LAUNCH_CHECK=strict` for Production (step 3), redeploy, and confirm the build passes.
- [ ] Domain connected and `site` set (step 4).
- [ ] Run Lighthouse on the production URL (see `DECISIONS.md` → Quality).

## Troubleshooting

| Build log says | Fix |
|---|---|
| `Launch check FAILED` | `LAUNCH_CHECK=strict` is set and placeholders remain. Fill them, or remove the variable until launch. |
| `Detected "engines": { "node": ">=24" }` warning | Fixed: `package.json` now pins `24.x`. |
| `npm warn Unknown env config "cache-dir"` | Harmless; it comes from Vercel's build image. |
