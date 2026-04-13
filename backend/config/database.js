const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;

mongoose.set('strictQuery', false);

const isPlaceholderUri = (uri) => {
    const normalized = uri.toLowerCase();
    return normalized.includes('username') || normalized.includes('password') || normalized.includes('cluster.abc.mongodb.net') || normalized.includes('example') || normalized.includes('<');
};

const connectDatabase = () => {
    if (!MONGO_URI || typeof MONGO_URI !== 'string' || MONGO_URI.trim() === '') {
        const message = 'Missing or invalid MONGO_URI environment variable. Set MONGO_URI in your .env or deployment settings.';
        console.error(message);
        return Promise.reject(new Error(message));
    }

    if (isPlaceholderUri(MONGO_URI)) {
        const message = 'MONGO_URI appears to contain placeholder values. Replace it with a real MongoDB connection string in your .env or deployment settings.';
        console.error(message);
        return Promise.reject(new Error(message));
    }

    return mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log('Mongoose Connected');
            return mongoose;
        })
        .catch((err) => {
            const message = `Mongoose connection error: ${err.message}`;
            console.error(message);
            return Promise.reject(new Error(message));
        });
}

module.exports = connectDatabase;