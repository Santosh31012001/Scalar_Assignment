# Backend Setup - Scalar Assignment

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Aiven PostgreSQL database

## Installation

1. Navigate to the backend directory:
```bash
cd BE
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update `DATABASE_URL` with your Aiven PostgreSQL connection string

```bash
cp .env.example .env
```

4. Initialize Prisma:
```bash
npm run prisma:generate
```

5. Run database migrations (after creating your schema):
```bash
npm run prisma:migrate
```

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:5000` (or the PORT specified in .env)

## Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with nodemon
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## Project Structure

```
BE/
├── src/
│   ├── config/
│   │   └── db.js          # Prisma client configuration
│   └── index.js           # Express server entry point
├── prisma/
│   └── schema.prisma      # Prisma schema file
├── .env                   # Environment variables (not in git)
├── .env.example           # Environment variables template
├── .gitignore
└── package.json
```

## Database Configuration

Update your `.env` file with your Aiven PostgreSQL credentials:

```env
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
```

## API Endpoints

- `GET /health` - Health check endpoint
- `GET /api` - API welcome message

## Next Steps

1. Define your database models in `prisma/schema.prisma`
2. Run migrations: `npm run prisma:migrate`
3. Create API routes in `src/routes/`
4. Add controllers in `src/controllers/`
5. Add middleware as needed
