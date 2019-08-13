'use strict'
const express = require('express');
const bookmarksRouter = express.Router();
const bodyParser = express.json();

const controllers = require('./bookmark-controller');

bookmarksRouter
    .route('/')
        .get(controllers.getBookmarks)
        .post(bodyParser, controllers.postBookmark);

bookmarksRouter
    .route('/:id')
        .all(controllers.allBookmarksIdRoute)
        .get(controllers.getBookmark)
        .delete(controllers.deleteBookmark);

module.exports = bookmarksRouter;
