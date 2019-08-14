const { expect } = require('chai');
const knex = require('knex');
const app = require('../src/app');
const { makeBookmarksArray } = require('./bookmarks.fixtures');
const apiToken = process.env.API_TOKEN;

let db;

before('Make knex instance', () => {
    db = knex({
        client: 'pg',
        connection: process.env.TEST_DB_URL,
    });

    app.set('db', db);
});

before('Truncate the bookmarks table', () => db('bookmarks').truncate());

after('Disconnect from the database', () => db.destroy());

afterEach('Truncate the bookmarks table between tests', () => db('bookmarks').truncate());

describe(`PATCH /api/bookmarks`, () => {
    context(`Given no articles in the database`, () => {
        it(`returns 404 when the given post is not found`, () => {
            updateBookmarkId = 3;
            return supertest(app)
                .post(`/api/bookmarks/${updateBookmarkId}`)
                .set('Authorization', 'Bearer ' + apiToken)
                .expect(404, {error: `Invalid request`, message: `Bookmark does not exist`});
        });
    });

    context(`Given articles in the database`, () => {
        const testBookmarks = makeBookmarksArray();
        beforeEach(`insert Bookmarks`, () => {
            return db
                .insert(testBookmarks)
                .into('bookmarks');
        });

        it(`returns 400 when none of the requried fields are provided`, () => {
            const updateBookmarkId = 1;
            return supertest(app)
                .patch(`/api/bookmarks/${updateBookmarkId}`)
                .set('Authorization', 'Bearer ' + apiToken)
                .expect(400, {error: {message: `At least one of 'title', 'url', description', or 'rating' is required`}});
        });
        
        it(`returns 204 with no content when an update is successful`, () => {
            const updateBookmarkId = 2;
            updatedBookmark = {
                title: 'Updated bookmark title',
                url: 'https://updatedurl.com',
                description: 'Updated description',
                rating: '1',
            };

            return supertest(app)
                .patch(`/api/bookmarks/${updateBookmarkId}`)
                .set('Authorization', 'Bearer ' + apiToken)
                .send(updatedBookmark)
                .expect(204)
        });

        it(`persists full updates the given bookmark`, () => {
            const updateBookmarkId = 2;
            updatedBookmark = {
                title: 'Updated bookmark title',
                url: 'https://updatedurl.com',
                description: 'Updated description',
                rating: '1',
            };

            expectedBookmark = {
                ...testBookmarks[ updateBookmarkId - 1],
                ...updatedBookmark,
            };

            return supertest(app)
                .patch(`/api/bookmarks/${updateBookmarkId}`)
                .set('Authorization', 'Bearer ' + apiToken)
                .send(updatedBookmark)
                .expect(204)
                .then(() =>
                    supertest(app)
                        .get(`/api/bookmarks/${updateBookmarkId}`)
                        .set('Authorization', 'Bearer ' + apiToken)
                        .expect(expectedBookmark)
                );
        });

        it(`persists partial updates to a bookmark`, () => {
            const updateBookmarkId = 3;
            updatedBookmark = {
                description: 'Updated description',
            };

            expectedBookmark = {
                ...testBookmarks[ updateBookmarkId - 1],
                ...updatedBookmark,
            };

            return supertest(app)
                .patch(`/api/bookmarks/${updateBookmarkId}`)
                .set('Authorization', 'Bearer ' + apiToken)
                .send(updatedBookmark)
                .expect(204)
                .then(() =>
                    supertest(app)
                        .get(`/api/bookmarks/${updateBookmarkId}`)
                        .set('Authorization', 'Bearer ' + apiToken)
                        .expect(expectedBookmark)
                );
        });
    });
});
