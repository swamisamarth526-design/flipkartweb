const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;

mongoose.set('strictQuery', false);

const connectDatabase = () => {
    if (!MONGO_URI || typeof MONGO_URI !== 'string' || MONGO_URI.trim() === '') {
        console.error('Missing or invalid MONGO_URI environment variable. Set MONGO_URI in your .env or deployment settings.');
        process.exit(1);
    }

    mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            console.log("Mongoose Connected");
        })
        .catch((err) => {
            console.error(`Mongoose connection error: ${err.message}`);
            process.exit(1);
        });
}

module.exports = connectDatabase;