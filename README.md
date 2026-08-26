# PAWLX 🐾

A modern B2C Pet Ecosystem — vet booking, grooming, pet sitting, adoption, a curated marketplace,
and an AI pet-care assistant, all in one platform. Built on the MERN stack.

**📋 See [`PROJECT_STATUS.md`](./PROJECT_STATUS.md) for exactly what's built, what's next, and how
to resume development.**

## Stack

- **Frontend**: React, Vite, Tailwind CSS v3, React Router, Axios, React Hook Form, Framer Motion
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, bcrypt, Cloudinary, Multer, Nodemailer
- **AI**: Anthropic API

## Quick Start

```bash
# Backend
cd backend && cp .env.example .env && npm install && npm run dev

# Seed demo data (in a new terminal, once the backend is running) — creates
# working login accounts across every role plus sample products/adoptions
cd backend && npm run seed

# Frontend (in a new terminal)
cd frontend && cp .env.example .env && npm install && npm run dev
```

Backend runs on `http://localhost:5000`, frontend on `http://localhost:5173`.

**Trouble logging in, or every page looks empty?** See [`TROUBLESHOOTING.md`](./TROUBLESHOOTING.md) —
almost always a `.env`/MongoDB connection issue on a fresh install, not an app bug, and the seed script
above fixes the "empty everywhere" issue specifically.

## Architecture

Strict enterprise MVC on the backend (`routes → controllers → services → models`), with validation
and error handling fully decoupled. Scalable folder structure on the frontend with a dedicated service
layer for all API calls — components never call Axios directly.

Priority order for every decision in this codebase: **Clean Architecture → Readability → Scalability
→ UI/UX → Performance → Features.**
