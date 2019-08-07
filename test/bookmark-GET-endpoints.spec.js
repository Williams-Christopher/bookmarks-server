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

describe('GET /bookmarks', function() {
    context('Given an empty database', () => {
        it('responds with 200 and an empty array', () => {
            return supertest(app)
                .get('/bookmarks')
                .set('Authorization', 'Bearer ' + apiToken)
                .expect(200, []);
        });
    });

    context('Given bookmarks in the database', () => {
        const testBookmarks = makeBookmarksArray();
        beforeEach('Insert test articles into table', () => {
            return db
                .insert(testBookmarks)
                .into('bookmarks');
        });

        it('GET /bookmarks responds with 200 and all the bookmarks', () => {
            return supertest(app)
                .get('/bookmarks')
                .set('Authorization', 'Bearer ' + apiToken)
                .expect(200, testBookmarks);
        });
    });
});

describe('GET /bookmark/:id', function() {
    context('Given an empty database', () => {
        it('responds with 404', () => {
        return supertest(app)
            .get('/bookmarks/123456')
            .set('Authorization', 'Bearer ' + apiToken)
            .expect(404, {error: {message: 'Bookmark does not exist.'}});
        });
    });

    context('Given bookmarks in the database', () => {
        const testBookmarks = makeBookmarksArray();
        beforeEach('Insert test articles into table', () => {
            return db
                .insert(testBookmarks)
                .into('bookmarks');
        });
        
        it('GET /bookmarks/:id returns 200 and the expected bookmark', () => {
        const bookmarkId = 2;
        const expectedBookmark = testBookmarks[bookmarkId - 1];
        return supertest(app)
            .get(`/bookmarks/${bookmarkId}`)
            .set('Authorization', 'Bearer ' + apiToken)
            .expect(200, expectedBookmark);
        });

        it('GET /bookmarks/:id returns 404 when an invalid bookmark is requested', () => {
            const invalidBookmarkId = 123456789;
            return supertest(app)
                .get(`/bookmarks/${invalidBookmarkId}`)
                .set('Authorization', 'Bearer ' + apiToken)
                .expect(404, {error: {message: 'Bookmark does not exist.'}});
        });
    });
});
