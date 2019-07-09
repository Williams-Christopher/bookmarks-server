const app = require('../src/app');
const apiToken = process.env.API_TOKEN;

const testGETBookmarkId = '7b825ada-b6df-476d-8fd0-adfff18ceab3';
const testDELETEBookmarkID = '8bfff525-476e-4aa4-8679-8c2a180b27ec';

describe('GET routes', () => {
    it('the /bookmarks route should return all bookmarks test data in JSON format', () => {
        return supertest(app)   
        .get('/bookmarks')
        .set('Authorization', 'Bearer ' + apiToken)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
            // This should return an array, even if there are zero bookmarks in the store
            expect(res.body).to.be.an('array');
        });
    });

    it('/boomarks/:id returns the specified bookmark test data in JSON format', () => {
        return supertest(app)   
        .get('/bookmarks/' + testGETBookmarkId)
        .set('Authorization', 'Bearer ' + apiToken)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
            expect(res.body).to.be.an('object')
            expect(res.body).to.include.all.keys('id', 'title', 'url', 'description', 'rating')
            expect(res.body).to.eql({
                id: '7b825ada-b6df-476d-8fd0-adfff18ceab3',
                title: 'Test bookmark #2',
                url: 'https://expressjs.com',
                description: 'The ExpressJS site - A really radical framework!',
                rating: 5
            });
        });
    });

    it('/bookmarks/:id returns a 404 when an invalid book mark id is requested', () => {
        return supertest(app)
        .get('/bookmarks/invalid')
        .set('Authorization', 'Bearer ' + apiToken)
        .expect(404);
    });
});

describe('POST routes', () => {
    it.skip('should return HTTP status 201 with a proper location header when a bookmark is successfully POSTEd', () => {
        return supertest(app)
        .post('/bookmarks')
        .set('Authorization', 'Bearer ' + apiToken)
        .send({
            'title': 'Supertest test',
            'url': 'https://www.npmjs.com/package/supertest',
            'description': 'Supertest docs',
            'rating': '5'
        })
        .set('Accept', 'application/json')
        .expect(201)
        //.expect('Location', /http:\/\/localhost:8000\/bookmarks\//);
        .end((err, res) => {
            if(err) {
                return done(err);
            }
            let includesLocationHeader = res.header['Location'].includes('http://localhost:8000/bookmarks/');
            expect(includesLocationHeader).to.be.True();
            done();
        });
    });

    it('should return HTTP status 400 when the POST request is not successful (missing or empty title)', () => {
        return supertest(app)
        .post('/bookmarks')
        .set('Authorization', 'Bearer ' + apiToken)
        .send({
            'title': '',
            'url': 'https://www.npmjs.com/package/supertest',
            'description': 'Supertest docs',
            'rating': '5'
        })
        .set('Accept', 'application/json')
        .expect(400)
        .expect({'error': 'Invalid request'});
    });
    
    it('should return HTTP status 400 when the POST request is not successful (missing or empty url)', () => {
        return supertest(app)
        .post('/bookmarks')
        .set('Authorization', 'Bearer ' + apiToken)
        .send({
            'title': 'Supertest title',
            'url': '',
            'description': 'Supertest docs',
            'rating': '5'
        })
        .set('Accept', 'application/json')
        .expect(400)
        .expect({'error': 'Invalid request'});
    });

    it('should return HTTP status 400 when the POST request is not successful (missing description)', () => {
        return supertest(app)
        .post('/bookmarks')
        .set('Authorization', 'Bearer ' + apiToken)
        .send({
            'title': 'Supertest test',
            'url': 'https://www.npmjs.com/package/supertest',
            // Description missing
            'rating': '5'
        })
        .set('Accept', 'application/json')
        .expect(400)
        .expect({'error': 'Invalid request'});
    });

    it('should return HTTP status 400 when the POST request is not successful (missing or empty rating)', () => {
        return supertest(app)
        .post('/bookmarks')
        .set('Authorization', 'Bearer ' + apiToken)
        .send({
            'title': 'Supertest test',
            'url': 'https://www.npmjs.com/package/supertest',
            'description': 'Supertest docs',
            'rating': ''
        })
        .set('Accept', 'application/json')
        .expect(400)
        .expect({'error': 'Invalid request'});
    });

    it('should return HTTP status 400 when the POST request is not successful (rating out of range 1 to 5)', () => {
        return supertest(app)
        .post('/bookmarks')
        .set('Authorization', 'Bearer ' + apiToken)
        .send({
            'title': 'Supertest test',
            'url': 'https://www.npmjs.com/package/supertest',
            'description': 'Supertest docs',
            'rating': '0'
        })
        .set('Accept', 'application/json')
        .expect(400)
        .expect({'error': 'Invalid request'});
    });

    it('should return HTTP status 400 when the POST request is not successful (rating out of range 1 to 5)', () => {
        return supertest(app)
        .post('/bookmarks')
        .set('Authorization', 'Bearer ' + apiToken)
        .send({
            'title': 'Supertest test',
            'url': 'https://www.npmjs.com/package/supertest',
            'description': 'Supertest docs',
            'rating': '6'
        })
        .set('Accept', 'application/json')
        .expect(400)
        .expect({'error': 'Invalid request'});
    });

    it('should return HTTP status 400 when the POST request is not successful (rating is NaN)', () => {
        return supertest(app)
        .post('/bookmarks')
        .set('Authorization', 'Bearer ' + apiToken)
        .send({
            'title': 'Supertest test',
            'url': 'https://www.npmjs.com/package/supertest',
            'description': 'Supertest docs',
            'rating': 'invalid'
        })
        .set('Accept', 'application/json')
        .expect(400)
        .expect({'error': 'Invalid request'});
    });
});

describe('DELETE routes', () => {
    it('should return HTTP status 400 if an invalid ID is supplied', () => {
        return supertest(app)
            .delete('/bookmarks/inavlidId')
            .set('Authorization', 'Bearer ' + apiToken)
            .expect(400)
            .expect({'error': 'Invalid request'});
    });

    it('should return HTTP status 204 when the request succeeds', () => {
        return supertest(app)
        .delete('/bookmarks/' + testDELETEBookmarkID)
        .set('Authorization', 'Bearer ' + apiToken)
        .expect(204)
    });
});