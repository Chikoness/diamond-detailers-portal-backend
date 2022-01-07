require('dotenv').config();

const PORT = process.env.PORT;
const SERVERPORT = process.env.SERVERPORT;
const MONGODB_KEY_URI = process.env.MONGODB_KEY_URI;
const SECRET = process.env.SECRET;

module.exports = {
    PORT,
    SERVERPORT,
    MONGODB_KEY_URI,
    SECRET,
};