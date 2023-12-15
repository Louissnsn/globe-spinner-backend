require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_CONNECTION_STRING, {
    connectTimeoutMS: 5000
})
.then(() => console.log('connected to database'))
.catch(() => console.log('failed to connect to database'));


