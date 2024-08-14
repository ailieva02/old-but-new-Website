const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connection = require('./dbConn.js')

dotenv.config();

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS);
console.log("DB_DATABASE:", process.env.DB_DATABASE);

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/userRoutes');
app.use('/api', userRoutes);

dotenv.config();

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
