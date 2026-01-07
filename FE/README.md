# Frontend - Scalar Assignment

## Tech Stack
- **React** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library
- **Lucide React** - Icon library

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd FE
```

2. Install dependencies (already done if you followed the setup):
```bash
npm install
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
FE/
├── src/
│   ├── components/      # Reusable components
│   │   └── ui/         # shadcn/ui components
│   ├── lib/
│   │   └── utils.js    # Utility functions
│   ├── App.jsx         # Main App component
│   ├── App.css         # App-specific styles
│   ├── index.css       # Global styles + Tailwind
│   └── main.jsx        # Entry point
├── public/             # Static assets
├── components.json     # shadcn/ui configuration
├── tailwind.config.js  # Tailwind configuration
├── postcss.config.js   # PostCSS configuration
├── vite.config.js      # Vite configuration
└── package.json
```

## Adding shadcn/ui Components

To add a new shadcn/ui component (e.g., Button):

```bash
npx shadcn@latest add button
```

This will download the component to `src/components/ui/button.jsx`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Connecting to Backend

The backend API is running on `http://localhost:5000`. You can make API calls using fetch or axios:

```javascript
// Example API call
const response = await fetch('http://localhost:5000/api/endpoint');
const data = await response.json();
```

## Environment Variables

Create a `.env` file in the FE directory:

```env
VITE_API_URL=http://localhost:5000
```

Access in your code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Styling with Tailwind

This project uses Tailwind CSS with shadcn/ui theming. Use utility classes:

```jsx
<div className="flex items-center justify-center p-4 bg-primary text-primary-foreground">
  <h1 className="text-2xl font-bold">Hello World</h1>
</div>
```

## Dark Mode

Dark mode is configured and ready to use. Toggle with:

```jsx
<html className="dark">
```

## Learn More

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vite.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
