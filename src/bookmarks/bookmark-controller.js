const express = require('express');
const logger = require('../logger');
const urlRegex = require('url-regex');
const xss = require('xss');
const BookmarksService = require('./BookmarksService');

const bookmarks = require('../store');

// borrowing from the Blogful drill solution
// https://github.com/Thinkful-Ed/blogful-api/blob/master/src/articles/articles-router.js
const serializeBookmark = bookmark => ({
    id: bookmark.id,
    title: xss(bookmark.title),
    url: xss(bookmark.url),
    description: xss(bookmark.description),
    rating: bookmark.rating,
});

module.exports.getBookmarks = function(req, res, next) {
    const knexInstance = req.app.get('db');
    return BookmarksService.getBookmarks(knexInstance)
        .then(bookmarks => {
            res.json(bookmarks);
        })
        .catch(next);
};

module.exports.postBookmark = function(req, res, next) {
    const { title, url, description = '', rating } = req.body;
    const newBookmark = {
        title: title,
        url: url,
        description: description,
        rating: rating
    };

    // validate that the keys are present in the request body
    for (const [key, value] of Object.entries(newBookmark)) {
        if(value == null) {
            return res.status(400).json({error: {message: `Missing ${key} from request body`}});
        }
    }

    // Perform some validation on the key values
    // Title is required
    if(!title || title === '') {
        logger.error(`Supplied title was invalid: ${title}`)
        return res.status(400).json({error: 'Invalid request', message: 'A value for title is required'});
    }

    // URL is required
    // Using url-regex to provide validation: https://www.npmjs.com/package/url-regex
    // Looking to at least reject a URL with a space in it and/or an invalid TLD
    if(!url || !urlRegex({exact: true, strict: false}).test(url)) {
        logger.error(`Provided URL failed regex validation: ${url}`);
        return res.status(400).json({error: 'Invalid request', message: 'The provided URL did not pass validation'});
    }

    // Description is an optional field, the value of which is defaulted if not supplied. No validation for it.

    // Rating is required
    const ratingNumber = Number(rating);
    if(isNaN(ratingNumber)) {
        logger.error(`Provided rating could no be converted to a number: ${rating}`);
        return res.status(400).json({error: 'Invalid request', message: 'The provided rating could not be converted to a number'});
    } else if(ratingNumber < 1 || ratingNumber > 5) {
        logger.error(`Provided rating was out of range 1 to 5: ${ratingNumber}`);
        return res.status(400).json({error: 'Invalid request', message: 'The provided rating must be an integer 1 to 5 inclusive'});
    }

    BookmarksService.insertBookmark(req.app.get('db'), newBookmark)
        .then(bookmark => {
            if(!bookmark) {
                logger.info(`An error occurred that prevented a new bookmark from being created`);
                res
                    .status(400)
                    .json({error: {message: 'An unknown error occurred - bookmark not created'}});
            }
            logger.info(`A new bookmark was successfully created in the store with ID ${bookmark.id}`);
            res
                .status(201)
                .location(`http://localhost:8000/api/bookmarks/${bookmark.id}`)
                .json(serializeBookmark(bookmark));
        })
        .catch(next);
};

module.exports.allBookmarksIdRoute = function(req, res, next) {
    const { id } = req.params;

    BookmarksService.getBookmarkById(req.app.get('db'), id)
        .then(bookmark => {
            if(!bookmark) {
                return res.status(404).json({error: `Invalid request`, message: `Bookmark does not exist`});
            }
            res.bookmark = bookmark;
            next();
            return null;
        })
        .catch(next);
}

module.exports.getBookmark = function(req, res, next) {
    res.json(res.bookmark);
};

module.exports.deleteBookmark = function(req, res) {
    const { id } = req.params;

    BookmarksService.deleteBookmark(req.app.get('db'), id)
        .then(() => {
            res.status(204).end()
        })
        .catch();
};
