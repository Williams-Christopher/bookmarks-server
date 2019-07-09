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
            return res.status(400).json({'error': 'Invalid request'});
        }
        debugger;
        // url not url like? nyet!
        if(!url || !urlRegex({exact: true, strict: false}).test(url)) {
            logger.error(`Supplied URL failed regex validation: ${url}`);
            return res.status(400).json({'error': 'Invalid request'});
        }

        // description just needs to be a key, it can be whatever includeing an empty string
        if(!description) {
            if(description !== '') {
                logger.error(`Description is undefined`);
                return res.status(400).json({'error': 'Invalid request'});
            }
        }

        // rating not a number between 1 and 5 inclusive? nein!
        let ratingNumber = Number(rating);
        if(isNaN(ratingNumber)) {
            logger.error(`Supplied rating could no be converted to a number: ${rating}`);
            return res.status(400).json({'error': 'Invalid request'});
        } else if(ratingNumber < 1 || ratingNumber > 5) {
            logger.error(`Supplied rating was out of range 1 to 5: ${ratingNumber}`);
            return res.status(400).json({'error': 'Invalid request'});
        }

        // Get an ID for this validated bookmark
        let newId = uuid();

        // Construct the new boomark object
        newBookmark = {
            id: newId,
            title: title,
            url: url,
            description: description,
            rating: rating
        };

        // and push it on the bookmark store
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
            return res.status(404).json({'error': 'Invalid request'});
        }

        res.json(bookmark);
    })
    .delete((req, res) => {
        const { id } = req.params;

        // check if the bookmark exists, return an error if not
        const bookmarkIndex = bookmarks.findIndex(b => b.id == id);
        if(bookmarkIndex === -1) {
            logger.error(`Requested bookmark does not exist for DELETE: ${id}`);
            return res.status(400).json({'error': 'Invalid request'});
        }

        bookmarks.splice(bookmarkIndex, 1);

        logger.info(`Bookmark with ID ${id} was successfully deleted`);
        res.status(204).end();
    });

module.exports = bookmarksRouter;
