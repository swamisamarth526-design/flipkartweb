const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const express = require('express');
const cloudinary = require('cloudinary');

const rootEnvPath = path.resolve(__dirname, '.env');
const backendEnvPath = path.resolve(__dirname, 'backend', 'config', 'config.env');

if (fs.existsSync(rootEnvPath)) {
    dotenv.config({ path: rootEnvPath });
    console.log('Loaded environment variables from .env');
} else if (process.env.NODE_ENV !== 'production' && fs.existsSync(backendEnvPath)) {
    dotenv.config({ path: backendEnvPath });
    console.log('Loaded environment variables from backend/config/config.env');
} else {
    console.warn('No local .env file found; relying on existing environment variables.');
}

const app = require('./backend/app');
const connectDatabase = require('./backend/config/database');
const PORT = process.env.PORT || 4000;

// UncaughtException Error
process.on('uncaughtException', (err) => {
    console.log(`Error: ${err.message}`);
    process.exit(1);
});

connectDatabase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// deployment
__dirname = path.resolve();
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '/frontend/build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
    });
} else {
    app.get('/', (req, res) => {
        res.send('Server is Running! 🚀');
    });
}

const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
});

// Unhandled Promise Rejection
process.on('unhandledRejection', (err) => {
    console.log(`Error: ${err.message}`);
    server.close(() => {
        process.exit(1);
    });
});
