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

describe(`DELETE endpoint /api/bookmarks/:id`, () => {
    context(`given there are bookmarks in 'bookmarks'`, () => {
        const testBookmarks = makeBookmarksArray();

        beforeEach(`insert test bookmarks into 'bookmarks`, () => {
            return db.insert(testBookmarks).into('bookmarks');
        });

        it(`responds with 204 and removes the bookmark`, () => {
            const bookmarkToRemove = 3;
            const expectedBookmarks = testBookmarks.filter(bookmark => bookmark.id !== bookmarkToRemove);
            return supertest(app)
                .delete(`/api/bookmarks/${bookmarkToRemove}`)
                .set('Authorization', 'Bearer ' + apiToken)
                .expect(204)
                .then(res =>
                    supertest(app)
                        .get(`/api/bookmarks`)
                        .set('Authorization', 'Bearer ' + apiToken)
                        .expect(expectedBookmarks)
                );
        });

        it(`responds with 404 given a bookmark ID that doesn't exist`, () => {
            const bookmark = 123456;
            return supertest(app)
                .delete(`/api/bookmarks/${bookmark}`)
                .set('Authorization', 'Bearer ' + apiToken)
                .expect(404, {error: `Invalid request`, message: `Bookmark does not exist`});
        });
    });

    context(`given no bookmarks in 'bookmarks`, () => {
        beforeEach(`truncate 'bookmarks'`, () => db('bookmarks').truncate());

        it(`responds with 404`, () => {
        const bookmark = 123456;
        return supertest(app)
            .delete(`/api/bookmarks/${bookmark}`)
            .set('Authorization', 'Bearer ' + apiToken)
            .expect(404, {error: `Invalid request`, message: `Bookmark does not exist`});
        });
    });
});
