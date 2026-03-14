# Attendance Tracker

A React + Vite app to manage semester attendance with Supabase auth and data storage.

## Prerequisites

- Node.js 20+
- npm

## Environment Setup

1. Copy `.env.example` to `.env`.
2. Fill in your Supabase project values.

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Local Development

```bash
npm install
npm run dev
```

## Production Build

```bash
npm run build
npm run preview
```

## Deployment

### Vercel

- Build command: `npm run build`
- Output directory: `dist`
- Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in project environment settings.
- `vercel.json` is included for SPA fallback routing.

### Netlify

- Build command: `npm run build`
- Publish directory: `dist`
- Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in site environment settings.
- `netlify.toml` is included for SPA fallback routing.

## Security Notes

- Keep only the anon key on frontend.
- Enable Supabase RLS and policies for all app tables before production use.
