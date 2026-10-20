require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const booksRoutes = require('./routes/books');
const readersRoutes = require('./routes/readers');
const loansRoutes = require('./routes/loans');


app.use('/api/books', booksRoutes);
app.use('/api/readers', readersRoutes);
app.use('/api/loans', loansRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the Book Library NodeJS API');
});

app.listen(process.env.APP_PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.APP_PORT}`);
});
