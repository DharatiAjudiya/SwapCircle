let mongoose = require('mongoose');
require('dotenv').config();
const DATABASE_URL = process.env.DATABASE_URL;

mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection

db.on('error', console.error.bind(console, 'Mongodb connection error: '));
db.once('open', ()=>{
    console.log('Connected to database')
});

module.exports = db;
