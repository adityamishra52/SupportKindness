# Care Contribution (MERN)

Production-style community support web platform with dynamic content, admin CRUD, and modern animated UI.

## Stack

- Frontend: React + Vite + Tailwind CSS v4 + React Router + Framer Motion + Axios
- Backend: Node.js + Express + MongoDB + Mongoose + Multer

## Project Structure

- `src/` - frontend app
- `backend/` - Express + MongoDB API

## Environment Variables

Frontend (`.env`)

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Care Contribution
```

Backend (`backend/.env`)

```env
PORT=5000
MONGODB_URI=
CLIENT_URL=http://localhost:5173
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend.vercel.app
```

## Install

1. Install frontend packages
2. Install backend packages

```bash
npm install
cd backend && npm install
```

## Run

1. Run backend

```bash
cd backend
npm run dev
```

2. Run frontend

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Main Features

- Dynamic activity, gallery, FAQ, testimonial, transparency, support, and contact data
- Admin dashboard for CRUD and uploads
- UPI + QR support section with copy and preview
- Dark/light mode with localStorage persistence
- Framer Motion route and section animations
- Gallery filter + load more + lightbox
- Contact form API integration
- Security middleware in backend: helmet, rate-limit, mongo-sanitize

## API Overview

- `POST/GET/PATCH/DELETE /api/contact`
- `POST/GET/PUT/DELETE /api/gallery`
- `POST/GET/PUT/DELETE /api/activities`
- `POST/GET /api/support`
- `POST/GET/PUT/DELETE /api/faqs`
- `POST/GET/PUT/DELETE /api/testimonials`
- `POST/GET/DELETE /api/transparency/reports`
- `GET/PUT /api/transparency/settings`

## Deployment Notes

- Deploy backend on a Node host (Render/Railway/VPS)
- Deploy frontend on Vercel/Netlify
- Set `VITE_API_BASE_URL` to deployed Render backend API URL
- Set backend `FRONTEND_URL`, `CLIENT_URL`, and `ALLOWED_ORIGINS` to include the deployed Vercel frontend URL

## Screenshots

- Add screenshots in `docs/screenshots/` and update this section with image links.
