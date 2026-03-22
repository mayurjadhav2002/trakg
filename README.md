# Trakg

Trakg is an open-source lead recovery and form analytics platform that helps businesses capture, analyze, and convert users who abandon forms before submission.

It tracks user interactions in real-time, captures partial form data, identifies drop-off points, and user information to recover lost leads and improve conversion rates.

Visit https://trakg.com for more details

![Trakg](https://trakg.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdioiyots5%2Fimage%2Fupload%2Fv1749884090%2Fscrnli_W7B3Q80LGtHH3o_aauyuz.png&w=750&q=75)

## Features

- Capture partial form submissions in real-time
- Track user behavior on forms and funnels
- Identify drop-off points and friction areas
- Recover abandoned leads automatically
- Real-time analytics and insights
- Background workers and cron jobs
- Multi-environment support



## Monorepo Structure
```
trakg/
├── server/        # Backend (API, workers, tracking engine)
├── trakg-v1/      # Frontend (dashboard & UI)
├── docs/          # Documentation (Mintlify)
```
---

## Tech Stack

- Backend (server): Node.js, TypeScript, Fastify, Prisma, PostgreSQL/MySQL, Redis/Valkey, BullMQ, JWT, Supabase, Cloudinary, Nodemailer  
- Frontend (trakg-v1): Next.js 15, React 19, TailwindCSS, TanStack Query, Redux Toolkit, Recharts, Chart.js, Radix UI  
- Docs (docs): Mintlify
---

## Environment Variables

Create `.env` files in both:
- server/.env
- trakg-v1/.env

---

### Frontend (.env)
```.env
BACKEND_URL=
NEXT_PUBLIC_BACKEND_URL=
NEXT_PUBLIC_BACKEND_API_VERSION=
NEXT_PUBLIC_TRACKING_SCRIPT_URL=
NEXT_PUBLIC_APP_ENVIRONMENT=production

CLOUDINARY_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_SECRET=

NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```
---

### Backend (.env)
```.env
DB_TYPE=postgres

DATABASE_URL=

VALKEY_PORT=
VALKEY_PASSWORD=

NODE_ENV=production
PORT=8000
API_VERSION=v1

BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000

REDIS_URL=
REDIS_HOST=
REDIS_PORT=
REDIS_PASSWORD=
REDIS_URI=

JWT_SECRET=
SESSION_SECRET=
SECRET_KEY_FOR_TOKEN=
SECRET_KEY_FOR_ACCESS_KEY=
SECRET_KEY_FOR_REFRESH_TOKEN=

MAIL_EMAIL=
MAIL_PASSWORD=
MAIL_HOST=
MAIL_PORT=

SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```
---

## Getting Started

### 1. Clone the repository

git clone https://github.com/mayurjadhav2002/trakg.git
cd trakg


## Backend Setup (server)
```
cd server
npm install
```
### Generate Prisma Client
```
npm run prisma:generate
```
### Run Migrations (required before starting server)
```
npm run prisma:migrate
```
### Start Backend
```
npm run dev
```
---

## Frontend Setup (trakg-v1)
```
cd trakg-v1
npm install
```
### Start Frontend
```
npm run dev
```
---

## Docker (Optional)
```
npm run docker:build
npm run docker:start
```

---

## License

This project is licensed under the Apache License 2.0.

---

## Contributing

Please refer to the `CONTRIBUTING.md` file for detailed contribution guidelines.

## Notes

- Ensure database and Redis/Valkey are running before starting the server
- Run Prisma migrations before starting the backend
- Background jobs are required for full functionality
