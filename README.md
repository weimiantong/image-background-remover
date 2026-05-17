# Image Background Remover

Free online tool to remove image backgrounds with AI.

## Features

- 🪄 One-click background removal
- 📁 Drag & drop upload (PNG/JPG/WEBP, max 10MB)
- 🔍 Original vs result comparison with checkerboard transparency
- 📥 Download transparent PNG
- 📱 Mobile friendly
- 🔒 API key secured server-side

## Tech Stack

- Next.js + TypeScript
- Tailwind CSS
- Remove.bg API
- Vercel deployment

## Getting Started

```bash
# Install dependencies
npm install

# Set your Remove.bg API key
cp .env.local.example .env.local
# Edit .env.local and add your REMOVE_BG_API_KEY

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/weimiantong/image-background-remover&env=REMOVE_BG_API_KEY)

Set the `REMOVE_BG_API_KEY` environment variable in Vercel dashboard.

## License

MIT
