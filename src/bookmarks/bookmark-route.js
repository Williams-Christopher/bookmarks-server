'use strict'
const express = require('express');
const logger = require('../logger');
const uuid = require('uuid/v4');
const urlRegex = require('url-regex');

const bookmarks = require('../store');

const bookmarksRouter = express.Router();
const bodyParser = express.json();

bookmarksRouter
    .route('/bookmarks')
    .get((req, res) => {
        res.json(bookmarks);
    })
    .post(bodyParser, (req, res) => {
        const { title, url, description = '', rating } = req.body;
        // Perform some validation
        // Title is required
        if(!title || title === '') {
            logger.error(`Supplied title was invalid: ${title}`)
            return res.status(400).json({'error': 'Invalid request', 'message': 'A value for title is required'});
        }

        // URL is required
        // Using https://www.npmjs.com/package/url-regex
        // Looking to at least reject a URL with a space in it and/or an invalid TLD
        if(!url || !urlRegex({exact: true, strict: false}).test(url)) {
            logger.error(`Provided URL failed regex validation: ${url}`);
            return res.status(400).json({'error': 'Invalid request', 'message': 'The provided URL did not pass validation'});
        }

        // Description is an optional field, the value of which is defualted if not supplied. No validation for it.

        // Rating is required
        const ratingNumber = Number(rating);
        if(isNaN(ratingNumber)) {
            logger.error(`Provided rating could no be converted to a number: ${rating}`);
            return res.status(400).json({'error': 'Invalid request', 'message': 'The provided rating could not be converted to a number'});
        } else if(ratingNumber < 1 || ratingNumber > 5) {
            logger.error(`Provided rating was out of range 1 to 5: ${ratingNumber}`);
            return res.status(400).json({'error': 'Invalid request', 'message': 'The provided rating must be a number 1 to 5 inclusive'});
        }

        const newId = uuid();

        const newBookmark = {
            id: newId,
            title: title,
            url: url,
            description: description,
            rating: rating
        };

        bookmarks.push(newBookmark);

        logger.info(`A new bookmark was successfully created in the store with ID ${newId}`);
        res.status(201).location(`http://localhost:8000/bookmarks/${newId}`).end();
    });

bookmarksRouter
    .route('/bookmarks/:id')
    .get((req, res) => {
        const { id } = req.params;

        const bookmark = bookmarks.find(b => b.id == id);
        if(!bookmark) {
            logger.error(`Requested bookmark does not exist for GET: ${id}`);
            return res.status(404).json({'error': 'Invalid request', 'message': 'The requested bookmark does not exist'});
        }

        res.json(bookmark);
    })
    .delete((req, res) => {
        const { id } = req.params;

        const bookmarkIndex = bookmarks.findIndex(b => b.id == id);
        if(bookmarkIndex === -1) {
            logger.error(`Requested bookmark does not exist for DELETE: ${id}`);
            return res.status(400).json({'error': 'Invalid request', 'message': 'The requested bookmark does not exist'});
        }

        bookmarks.splice(bookmarkIndex, 1);

        logger.info(`Bookmark with ID ${id} was successfully deleted`);
        res.status(204).end();
    });

module.exports = bookmarksRouter;
