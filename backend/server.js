const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const crypto = require('crypto');
const axios = require('axios');


const app = express();  // don't forget to install express package
const port = process.env.PORT || 5003; // don't forget to set PORT environment variable

const mainRoutes = require('./routes/index'); // don't forget to create routes/index.js

app.use(cors()); // don't forget to install cors package
app.use(express.json());    // don't forget to install express package
app.use('/api', mainRoutes); // don't forget to create routes/index.js



const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log('Connected to the MongoDB database!');
    } catch (error) {
        console.error('Error connecting to the database:', error);
        process.exit(1);
    }
};





app.listen(port, async () => {
    await connectDB();
    console.log(`Server listening on port ${port}`);
});