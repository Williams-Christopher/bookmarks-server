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
        let { title, url, description, rating } = req.body;
        //Perform some validation
        // title missing? reject!
        if(!title || title === '') {
            logger.error(`Supplied title was invalid: ${title}`)
            return res.status(400).json({'error': 'Invalid request', 'message': 'A value for title is required'});
        }

        // url not url like? nyet!
        // using https://www.npmjs.com/package/url-regex
        // looking to at least reject a URL with a space in it and/or an invalid TLD
        if(!url || !urlRegex({exact: true, strict: false}).test(url)) {
            logger.error(`Provided URL failed regex validation: ${url}`);
            return res.status(400).json({'error': 'Invalid request', 'message': 'The provided URL did not pass validation'});
        }

        // description just needs to be a key, the value can be whatever including an empty string
        if(!description) {
            if(description !== '') {
                logger.error(`Description is undefined`);
                return res.status(400).json({'error': 'Invalid request'});
            }
        }

        // rating not a number between 1 and 5 inclusive? nein!
        const ratingNumber = Number(rating);
        if(isNaN(ratingNumber)) {
            logger.error(`Provided rating could no be converted to a number: ${rating}`);
            return res.status(400).json({'error': 'Invalid request', 'message': 'The provided rating could not be converted to a number'});
        } else if(ratingNumber < 1 || ratingNumber > 5) {
            logger.error(`Provided rating was out of range 1 to 5: ${ratingNumber}`);
            return res.status(400).json({'error': 'Invalid request', 'message': 'The provided rating must be a number 1 to 5 inclusive'});
        }

        // Get an ID for this validated bookmark
        const newId = uuid();

        // Construct the new boomark object...
        const newBookmark = {
            id: newId,
            title: title,
            url: url,
            description: description,
            rating: rating
        };

        // ...and push it on the bookmark store
        bookmarks.push(newBookmark);

        // respond to the client
        logger.info(`A new bookmark was successfully created in the store with ID ${newId}`);
        res.status(201).location(`http://localhost:8000/bookmarks/${newId}`).end();
    });

bookmarksRouter
    .route('/bookmarks/:id')
    .get((req, res) => {
        const { id } = req.params;

        // get the bookmark, return an error if it doesn't exist
        const bookmark = bookmarks.find(b => b.id == id);
        if(!bookmark) {
            logger.error(`Requested bookmark does not exist for GET: ${id}`);
            return res.status(404).json({'error': 'Invalid request', 'message': 'The requested bookmark does not exist'});
        }

        res.json(bookmark);
    })
    .delete((req, res) => {
        const { id } = req.params;

        // check if the bookmark exists, return an error if not
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
