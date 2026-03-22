# Trakg Server

This is the backend service for Trakg — an open-source lead recovery and form analytics platform.

The server handles event ingestion, form tracking, lead recovery workflows, background jobs, and API services for the frontend dashboard.

---

## Tech Stack

- Node.js, TypeScript, Fastify, Prisma, PostgreSQL/MySQL, Redis/Valkey, BullMQ, JWT, Supabase, Cloudinary, Nodemailer

---

## Getting Started

### 1. Install dependencies
```
npm install
```
---

## Environment Variables

Create a `.env` file in the root of `server` with the following:
```
DB_TYPE=postgres

DATABASE_URL=

VALKEY_PORT=
VALKEY_PASSWORD=

NODE_ENV=development
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

## Database Setup

### Generate Prisma Client

npm run prisma:generate

### Run Migrations (required before starting server)

npm run prisma:migrate

---

## Running the Server

### Development
```
npm run dev
```
### Production
```
npm run build  
npm start  
```
---

## Background Jobs

Run workers and cron jobs will start automatically on running the server
---

## Docker (Optional)
```
npm run docker:build  
npm run docker:start  
```
---

## Project Structure
```
src/
├── controllers/     # Route handlers  
├── services/        # Business logic  
├── routes/          # API routes  
├── middlewares/     # Middleware logic  
├── utils/           # Helper functions  
├── scripts/         # Internal scripts (tracker build, etc.)  
```
---

## Notes

- Ensure database and Redis/Valkey are running before starting the server  
- Run Prisma migrations before starting the backend  
- Background jobs are required for full functionality  
- API versioning is controlled via API_VERSION  

---

## Related

- Main repository: https://github.com/mayurjadhav2002/trakg  
- Frontend: ../trakg-v1  
- Documentation: ../docs  

---

## License

Licensed under the Apache License 2.0.