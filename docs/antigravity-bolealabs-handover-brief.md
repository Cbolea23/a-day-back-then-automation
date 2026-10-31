# Handover Brief — Bolea Labs Website, Portfolio & TikTok App Fix

From: Muse (via Christian) · Date: October 27, 2026
For: Antigravity — you are taking over execution of this project.

## What we are building

**bolealabs.site** — Christian's studio domain for **Bolea Labs**, purchased October 27, 2026 on Namecheap (order 217822665, account `alpuerto213`). Note: the TLD is **.site**, not .com. bolealabs.com was never bought.

One website, two jobs:

1. **Christian's personal portfolio** for his upcoming OJT placement — his projects and certifications, under the Bolea Labs studio brand.
2. **The official website for the TikTok developer app "A Day Back Then Automation"** (developers.tiktok.com/app/7694755851403986962). Production review was REJECTED because the Website URL was a temporary/tunnel URL. TikTok requires: a permanent website on the organization's own domain, fully developed (not a landing/login page), Privacy Policy and Terms of Service accessible, and the app framed as a public creator tool — apps for personal/internal use are ineligible.

## Already done (by Muse)

- **Full static site built** — plain HTML/CSS, no build step, 5 files:
  - `index.html` — portfolio home: hero (Christian Bolea, student developer, OJT objective), Projects (A Day Back Then automation, Content Operations Dashboard, 24/7 YouTube Livestream System, Agensi AI skill products), Technical Skills, Certifications (placeholder — see Rules), About, Contact (contact@bolealabs.site).
  - `adaybackthen.html` — A Day Back Then project page (shows, where to watch).
  - `privacy.html` / `terms.html` — operator "Bolea Labs", covers the publishing software's OAuth use; these are the URLs the TikTok app will point to.
  - `CNAME` — contains `bolealabs.site`.
- Files are in the **Drive handover folder root** (uploaded Oct 27) and on Muse's box at `~/workspace/bolealabs-site/`.
- **Deploy keypair generated** for the new repo. Private key stays on Muse's box (`/home/hatch/.ssh/bolealabs-portfolio-deploy`). Public key to add to the repo:

  `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIDClhgiSX4MNbHah/2xTmXvAcsMQVMKiSIF3dDl3QWr8 bolealabs-portfolio-deploy`

## Remaining steps, in order

1. **Christian** creates the GitHub repo **`bolealabs-portfolio`** under `Cbolea23` — Public, completely empty (no README). Then repo Settings → Deploy keys → add the public key above, **Allow write access** checked.
2. Push the 5 site files to the repo's `main` branch (Muse via deploy key, or Antigravity from the PC — whoever moves first; coordinate in the bridge channel so it isn't done twice).
3. Enable **GitHub Pages**: repo Settings → Pages → Deploy from branch `main`, root. Custom domain: `bolealabs.site`.
4. **Namecheap DNS** (bolealabs.site → Advanced DNS) — add:
   - A record, host `@` → `185.199.108.153`
   - A record, host `@` → `185.199.109.153`
   - A record, host `@` → `185.199.110.153`
   - A record, host `@` → `185.199.111.153`
   - CNAME record, host `www` → `cbolea23.github.io`
5. Wait for DNS + GitHub's automatic HTTPS certificate, then turn on **Enforce HTTPS** in Pages settings. Verify all four pages load: `/`, `/adaybackthen.html`, `/privacy.html`, `/terms.html`.
6. **TikTok console** (app "A Day Back Then Automation"):
   - Website URL → `https://bolealabs.site`
   - Privacy Policy URL → `https://bolealabs.site/privacy.html`
   - Terms of Service URL → `https://bolealabs.site/terms.html`
   - URL properties → verify `bolealabs.site` — TikTok gives a TXT record; add it in Namecheap Advanced DNS and complete verification.
   - Rewrite the app description as a **public creator publishing tool** (never "internal/personal automation").
   - **Rotate the client secret** — it was exposed in a plaintext screenshot on Oct 27. Never print or store the new value in chat, memory, or the repo.
   - Resubmit for production review. A short demo video of the posting flow may be required for the Content Posting API.
7. **After approval only:** OAuth-connect the channel's TikTok account using the Shorts Factory repo's existing scripts (`scripts/auth-tiktok.mjs`, posting via `scripts/upload-tiktok.mjs`).

## Rules that still apply

- Nothing gets published or scheduled anywhere without Christian's review (the 1-click gate).
- The Certifications section stays a placeholder until Christian provides his certification list/files — do not invent entries.
- The domain renews at roughly $25–35/yr (.site year-1 promo pricing) — known and accepted, no action needed.
- Repo `Cbolea23/a-day-back-then-automation` is a separate repo — this project does not touch it.
