# Deployment Plan: ORIN Store (Medusa v2 + Next.js)

This document contains the server configuration and deployment details for the ORIN store based on the CloudPanel setup.

## Server Infrastructure

| | |
|---|---|
| **Server IP** | 82.29.181.61 |
| **Control Panel** | CloudPanel |
| **Global Password** | a550055A! |

---

## 1. Backend (Medusa API)

| | |
|---|---|
| **Domain** | api.orin.se |
| **Site User** | orin-api |
| **Root Directory** | /home/orin-api/htdocs/api.orin.se |
| **App Directory** | /home/orin-api/htdocs/api.orin.se/apps/backend |
| **Port** | 9000 |
| **PM2 Name** | orin-backend |

### Deployment Strategy (Backend)
- Deploy the Medusa v2 backend to `/home/orin-api/htdocs/api.orin.se`
- Use PM2 to run the Node.js server
- Configure Nginx in CloudPanel (Vhost settings) to reverse proxy `api.orin.se → localhost:9000`
- Set `.env` with production DATABASE_URL, REDIS_URL, JWT_SECRET, COOKIE_SECRET, and CORS origins

### Nginx Vhost (CloudPanel)
```nginx
location / {
    proxy_pass http://127.0.0.1:9000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

---

## 2. Frontend (Next.js Storefront)

| | |
|---|---|
| **Domain** | www.orin.se |
| **Site User** | orin |
| **Root Directory** | /home/orin/htdocs/www.orin.se |
| **App Directory** | /home/orin/htdocs/www.orin.se/apps/storefront |
| **Port** | 8000 |
| **PM2 Name** | orin-frontend |

### Deployment Strategy (Frontend)
- Deploy the Next.js storefront to `/home/orin/htdocs/www.orin.se`
- Build with `npm run build` and run in production via PM2
- Configure Nginx in CloudPanel (Vhost settings) to reverse proxy `www.orin.se → localhost:8000`
- Set `.env.local` with `NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.orin.se`

### Nginx Vhost (CloudPanel)
```nginx
location / {
    proxy_pass http://127.0.0.1:8000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

---

## Next Steps for Deployment

1. **CloudPanel Sites** — Create two sites:
   - `api.orin.se` with user `orin-api`
   - `www.orin.se` with user `orin` (if not already created)

2. **Database Setup** — Create a PostgreSQL database in CloudPanel for Medusa

3. **Redis Setup** — Ensure Redis is installed and running on the server

4. **Environment Variables** — Create `.env` files on the server before deploying:
   - Backend: `/home/orin-api/htdocs/api.orin.se/apps/backend/.env`
     (use `apps/backend/.env.production.template` as reference)
   - Frontend: `/home/orin/htdocs/www.orin.se/apps/storefront/.env.local`
     (use `apps/storefront/.env.production.template` as reference)

5. **SSL/TLS** — Enable Let's Encrypt certificates for both domains via CloudPanel

6. **Deploy** — Run from your local machine:
   ```bash
   node deploy.mjs            # both backend + frontend
   node deploy.mjs backend    # backend only
   node deploy.mjs frontend   # frontend only
   ```

7. **GitHub Repository** — https://github.com/mohamedal2min-u/orin-store
