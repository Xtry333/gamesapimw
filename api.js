const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const user = process.env.MONGO_ATLAS_US;
const passwd = process.env.MONGO_ATLAS_PW;

mongoose.connect(`mongodb+srv://${user}:${passwd}@cluster0-otcey.mongodb.net/games?retryWrites=true`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
});

const app = express();

const gamesRoutes = require('./api/routes/games');
const usersRoutes = require('./api/routes/users');
const ranksRoutes = require('./api/routes/ranks');

app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    next();
});

app.use('/games', gamesRoutes);
app.use('/users', usersRoutes);
app.use('/ranks', ranksRoutes);

app.use((req, res, next) => {
    const error = new Error("I'm a teapot");
    error.status = 418;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({error: {
        message: error.message,
        coffee: false
    }});
});

module.exports = app;