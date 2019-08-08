const { expect } = require('chai');
//const knex = require('knex');
const app = require('../src/app');
const { makeBookmarksArray, makeMaliciousBookmark } = require('./bookmarks.fixtures');
const apiToken = process.env.API_TOKEN;

describe('POST endpoints', () => {
    it('should return HTTP status 201 when a bookmark is successfully POSTed', () => {
        const testBookmark = makeBookmarksArray()[0];
        return supertest(app)
            .post('/bookmarks')
            .set('Authorization', 'Bearer ' + apiToken)
            .send(testBookmark)
            .set('Accept', 'application/json')
            .expect(201)
    });

    it(`should return HTTP status 201 and successfully persist a POSTed bookmark`, () => {
        const testBookmark = makeBookmarksArray()[0];
        return supertest(app)
            .post('/bookmarks')
            .set('Authorization', 'Bearer ' + apiToken)
            .send(testBookmark)
            .set('Accept', 'application/json')
            .expect(201)
            .expect(res => {
                expect(res.body).to.have.property('id')
                expect(res.body.title).to.eql(testBookmark.title)
                expect(res.body.url).to.eql(testBookmark.url)
                expect(res.body.description).to.eql(testBookmark.description)
                expect(res.body.rating).to.eql(testBookmark.rating)
            })
            .then(postRes =>
                supertest(app)
                    .get(`/bookmarks/${postRes.body.id}`)
                    .set('Authorization', 'Bearer ' + apiToken)
                    .set('Accept', 'application/json')
                    .expect(postRes.body)
            );
    });

    // TODO: refactor this test to use the id returned from the post
    it.skip('should return HTTP status 201 with a proper location header when a bookmark is successfully POSTed', () => {
        return supertest(app)
            .post('/bookmarks')
            .set('Authorization', 'Bearer ' + apiToken)
            .send(makeBookmarksArray()[0])
            .set('Accept', 'application/json')
            .expect(201)
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                let includesLocationHeader = res.header['Location'].includes('http://localhost:8000/bookmarks/');
                expect(includesLocationHeader).to.be.True();
                done();
        });
    });

    it('should return HTTP status 201 when the bookmark is POSTed with an empty description (optional field)', () => {
        const testBookmark = makeBookmarksArray()[0];
        testBookmark.description = '';
        return supertest(app)
            .post('/bookmarks')
            .set('Authorization', 'Bearer ' + apiToken)
            .send(testBookmark)
            .set('Accept', 'application/json')
            .expect(201)
    });

    it('should return HTTP status 400 when the POST request is not successful (missing or empty title)', () => {
        const testBookmark = makeBookmarksArray()[0];
        testBookmark.title = '';
        return supertest(app)
            .post('/bookmarks')
            .set('Authorization', 'Bearer ' + apiToken)
            .send(testBookmark)
            .set('Accept', 'application/json')
            .expect(400)
            .expect({'error': 'Invalid request', 'message': 'A value for title is required'});
    });
    
    it('should return HTTP status 400 when the POST request is not successful (URL missing or empty)', () => {
        const testBookmark = makeBookmarksArray()[0];
        testBookmark.url = '';
        return supertest(app)
            .post('/bookmarks')
            .set('Authorization', 'Bearer ' + apiToken)
            .send(testBookmark)
            .set('Accept', 'application/json')
            .expect(400)
            .expect({'error': 'Invalid request', 'message': 'The provided URL did not pass validation'});
    });

    it('should return HTTP status 400 when the POST request is not successful (missing or empty rating)', () => {
        const testBookmark = makeBookmarksArray()[0];
        testBookmark.rating = '';
        return supertest(app)
            .post('/bookmarks')
            .set('Authorization', 'Bearer ' + apiToken)
            .send(testBookmark)
            .set('Accept', 'application/json')
            .expect(400)
            .expect({'error': 'Invalid request', 'message': 'The provided rating must be an integer 1 to 5 inclusive'});
    });

    it('should return HTTP status 400 when the POST request is not successful (rating out of range 1 to 5 -> 0)', () => {
        const testBookmark = makeBookmarksArray()[0];
        testBookmark.rating = '0';
        return supertest(app)
            .post('/bookmarks')
            .set('Authorization', 'Bearer ' + apiToken)
            .send(testBookmark)
            .set('Accept', 'application/json')
            .expect(400)
            .expect({'error': 'Invalid request', 'message': 'The provided rating must be an integer 1 to 5 inclusive'});
    });

    it('should return HTTP status 400 when the POST request is not successful (rating out of range 1 to 5 -> 6)', () => {
        const testBookmark = makeBookmarksArray()[0];
        testBookmark.rating = '6';
        return supertest(app)
            .post('/bookmarks')
            .set('Authorization', 'Bearer ' + apiToken)
            .send(testBookmark)
            .set('Accept', 'application/json')
            .expect(400)
            .expect({'error': 'Invalid request', 'message': 'The provided rating must be an integer 1 to 5 inclusive'});
    });

    it('should return HTTP status 400 when the POST request is not successful (rating is NaN -> "invalid")', () => {
        const testBookmark = makeBookmarksArray()[0];
        testBookmark.rating = 'invalid';
        return supertest(app)
            .post('/bookmarks')
            .set('Authorization', 'Bearer ' + apiToken)
            .send(testBookmark)
            .set('Accept', 'application/json')
            .expect(400)
            .expect({'error': 'Invalid request', 'message': 'The provided rating could not be converted to a number'});
    });

    context(`given a bookmark with XSS attack payload`, () => {
        const { maliciousBookmark, sanitizedBookmark } = makeMaliciousBookmark();

        it(`removes the XSS attack content`, () => {
            return supertest(app)
                .post('/bookmarks')
                .set('Authorization', 'Bearer ' + apiToken)
                .send(maliciousBookmark)
                .set('Accept', 'application/json')
                .expect(201)
                .expect(res => {
                    expect(res.body).to.have.property('id');
                    expect(res.body.title).to.eql(sanitizedBookmark.title)
                    expect(res.body.description).to.eql(sanitizedBookmark.description)
                });
        });
    });
});
