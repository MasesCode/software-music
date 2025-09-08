# Music Portal

A modern music catalog application with YouTube suggestions, user management, and admin features.

## Features

- 🎵 Music catalog with search and filtering
- 🔐 Authentication (login/register)
- 📝 YouTube music suggestions (CRUD)
- 👥 User management (admin only)
- 📊 System logs (admin only)
- 🌍 Multi-language support (EN/PT/ES)
- 🎨 Dark/Light theme support
- 📱 Responsive design

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Zustand (state management)
- React Hook Form + Zod
- React Router DOM

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

3. Start development server:
```bash
npm run dev
```

## Color Palette

The app uses a custom palette based on provided colors:
- Primary: #1c0113 (dark burgundy)
- Secondary: #6b0103 (dark red)  
- Accent: #f03c02 (bright orange-red)

## Development

Mock data is included for development without a backend.