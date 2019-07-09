'use strict'
const express = require('express');
const bookmarksRouter = express.Router();
const bodyParser = express.json();

const controllers = require('./bookmark-controller');

bookmarksRouter
    .route('/bookmarks')
        .get(controllers.getBookmarks)
        .post(bodyParser, controllers.postBookmark);

bookmarksRouter
    .route('/bookmarks/:id')
        .get(controllers.getBookmark)
        .delete(controllers.deleteBookmark);

module.exports = bookmarksRouter;
