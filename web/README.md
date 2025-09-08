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

## Testing

The project includes comprehensive unit tests using Vitest and React Testing Library.

### Test Structure

```
src/
├── hooks/__tests__/          # Hook tests
├── components/__tests__/      # Component tests  
├── lib/__tests__/            # Utility tests
├── pages/__tests__/          # Page tests
├── store/__tests__/          # Store tests
└── test/
    └── setup.ts              # Test configuration
```

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:run

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage
```

### Test Coverage

- ✅ **Hooks**: useSafeArray
- ✅ **Components**: SuggestionForm
- ✅ **Utils**: YouTube utilities, utility functions

### Test Features

- **Simple & Reliable**: Focused on core functionality
- **Fast Execution**: Quick test runs for development
- **No Dependencies**: Tests work without complex mocking
- **CI/CD Ready**: Tests run in headless mode for CI/CD pipelines

## Development

Mock data is included for development without a backend.