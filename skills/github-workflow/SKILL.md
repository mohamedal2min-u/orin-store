---
name: github-workflow
description: GitHub version control and deployment workflow for ORIN.SE. Covers branching strategy, commit conventions, CI/CD via GitHub Actions, and automated deployment to VPS.
---

# GitHub Workflow — ORIN.SE

> All code lives on GitHub. Every push is a backup. Deployments are triggered by merges to `main`.

---

## When to Use

- Setting up the repository
- Creating branches for features or fixes
- Writing commit messages
- Configuring CI/CD pipelines
- Deploying to production

---

## Repository Structure

```
orin-se/                      # Single monorepo
├── backend/                  # Medusa v2
├── storefront/               # Next.js
├── scripts/                  # VPS management scripts
├── skills/                   # Antigravity skills
├── PROJECT_CONTEXT.md
├── CLAUDE.md
├── .gitignore
└── .github/
    └── workflows/
        ├── ci.yml            # Lint + type-check + build
        └── deploy.yml        # Deploy to VPS on merge to main
```

---

## Branching Strategy

```
main (production)
  └── develop (staging/integration)
        ├── feature/add-product-page
        ├── feature/klarna-integration
        ├── fix/image-loader-bug
        └── chore/update-dependencies
```

| Branch       | Purpose                    | Deploys To    |
|--------------|----------------------------|---------------|
| `main`       | Production-ready code      | VPS (auto)    |
| `develop`    | Integration / staging      | —             |
| `feature/*`  | New features               | —             |
| `fix/*`      | Bug fixes                  | —             |
| `chore/*`    | Dependencies, cleanup      | —             |

### Rules:
1. **Never push directly to `main`** — always merge via PR
2. **`develop` → `main`** via PR with review
3. **Feature branches** branch from `develop`, merge back to `develop`
4. **Keep branches short-lived** — merge or delete within a week

---

## Commit Conventions

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

feat(storefront): add product card component
fix(backend): correct R2 upload path encoding
chore(deps): update medusa to v2.x.x
docs(skills): add cloudflare-r2-cdn skill
style(storefront): adjust product grid spacing
refactor(backend): extract image variant logic
perf(storefront): optimize hero image loading
```

### Types:
- `feat` — new feature
- `fix` — bug fix
- `chore` — maintenance (deps, configs)
- `docs` — documentation
- `style` — visual/CSS changes
- `refactor` — code restructuring
- `perf` — performance improvement
- `test` — adding/fixing tests

---

## .gitignore

```gitignore
# Dependencies
node_modules/
.pnpm-store/

# Build output
.next/
.medusa/
dist/

# Environment
.env
.env.local
.env.production

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Logs
*.log
pm2-*.log

# Temporary
*.tmp
*.bak
convert_doc.ps1
mvp_plan.md
mvp_plan_utf8.md
```

---

## CI/CD: GitHub Actions

### CI Pipeline (`ci.yml`)

Runs on every PR and push to `develop`:

```yaml
name: CI
on:
  pull_request:
    branches: [develop, main]
  push:
    branches: [develop]

jobs:
  lint-and-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 'lts/*'
          cache: 'pnpm'

      - name: Install backend deps
        run: cd backend && pnpm install --frozen-lockfile

      - name: Lint backend
        run: cd backend && pnpm lint

      - name: Build backend
        run: cd backend && pnpm build

      - name: Install storefront deps
        run: cd storefront && pnpm install --frozen-lockfile

      - name: Lint storefront
        run: cd storefront && pnpm lint

      - name: Type check storefront
        run: cd storefront && pnpm tsc --noEmit

      - name: Build storefront
        run: cd storefront && pnpm build
```

### Deploy Pipeline (`deploy.yml`)

Runs on merge to `main`:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            cd /home/deploy/orin.se
            git pull origin main
            cd backend && pnpm install --frozen-lockfile && pnpm build
            pm2 restart medusa-backend --update-env
            cd ../storefront && pnpm install --frozen-lockfile && pnpm build
            pm2 restart nextjs-storefront
            pm2 status
```

---

## GitHub Secrets

| Secret          | Description                     |
|-----------------|---------------------------------|
| `VPS_HOST`      | Hetzner VPS IP address          |
| `VPS_USER`      | SSH user (e.g., `deploy`)       |
| `VPS_SSH_KEY`   | Private SSH key for deployment  |

---

## Protected Branch Rules (main)

- [ ] Require pull request reviews (1 reviewer)
- [ ] Require status checks to pass (CI)
- [ ] Require branches to be up to date
- [ ] No direct pushes

---

## Rules

1. **`.env` is in `.gitignore`** — never commit secrets
2. **`pnpm-lock.yaml` IS committed** — ensures reproducible installs
3. **Every push to GitHub = automatic code backup**
4. **Merge to `main` = automatic production deploy**
5. **PR title follows Conventional Commits format**
6. **Keep PRs small and focused** — one feature or fix per PR
7. **Delete merged branches** — keep the repo clean
