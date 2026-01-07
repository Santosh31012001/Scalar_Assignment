const express = require('express');
const cors = require('cors');
require('dotenv').config();
const prisma = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// for development only, strictly not for production
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Scalar Assignment' });
});

// API Routes
const eventTypesRoutes = require('./routes/eventTypes');
app.use('/api/event-types', eventTypesRoutes);


// Database health check endpoint
app.get('/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.json({
            status: 'ok',
            message: 'Server is running',
            database: 'connected'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Server is running',
            database: 'disconnected',
            error: error.message
        });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Database connection and server startup
async function startServer() {
    try {
        // Test database connection
        await prisma.$connect();
        console.log('✅ Database connected successfully');

        // Start server
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.error('Please check your DATABASE_URL in .env file');
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await prisma.$disconnect();
    process.exit(0);
});

startServer();
