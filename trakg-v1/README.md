# Trakg Frontend (trakg-v1)

This is the frontend application for Trakg — an open-source lead recovery and form analytics platform.

The frontend provides the dashboard, analytics views, and user interface for managing captured leads, tracking form activity, and analyzing user behavior.

---

## Tech Stack

- Next.js 15, React 19, TailwindCSS, TanStack Query, Zustand, Recharts, Chart.js, Radix UI

---

## Getting Started

### 1. Install dependencies
```
npm install
```

---

## Environment Variables

Create a `.env` file in the root of `trakg-v1` with the following:

BACKEND_URL=
NEXT_PUBLIC_BACKEND_URL=
NEXT_PUBLIC_BACKEND_API_VERSION=
NEXT_PUBLIC_TRACKING_SCRIPT_URL=
NEXT_PUBLIC_APP_ENVIRONMENT=development

CLOUDINARY_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_SECRET=

NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

---

## Running the App

Start the development server:

npm run dev

The app will be available at:

http://localhost:3000

---

## Build for Production

npm run build  
npm start  

---

## Project Structure
```
src/
├── components/      # Reusable UI components  
├── app/             # Next.js pages / routes  
├── hooks/           # Custom React hooks  
├── stores/          # persistent store  
├── lib/             # Helper functions  
```
---

## Notes

- Ensure the backend server is running before starting the frontend  
- Environment variables must be configured correctly  
- Uses API versioning via NEXT_PUBLIC_BACKEND_API_VERSION  
- Tracking script URL must point to the backend tracker build  

---

## Related

- Main repository: https://github.com/mayurjadhav2002/trakg  
- Documentation: Refer to the `/docs` folder in the root project  

---

## License

Licensed under the Apache License 2.0.