'use strict'
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./logger');
const { NODE_ENV } = require('./config');
const bookmarksRouter = require('./bookmarks/bookmark-route');

const app = express();

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN;
    const authToken = req.get('Authorization');
    if(!authToken || authToken.split(' ')[1] !== apiToken) {
        logger.error(`Invalid API key in request authorization header`);
        return res.status(400).json({error: 'Unauthorized request'});
    }
    next();
});

app.use('/api/bookmarks', bookmarksRouter);

app.use(function errorHandler(error, req, res, next) {
    let response;
    if (NODE_ENV === 'production') {
        response = { error: { message: 'Server error' } };
    } else {
        response = { error };
    };
    logger.error(error);
    res.status(500).json(response);
});

app.get('/', (req, res) => {
    res.end()
});

module.exports = app;
