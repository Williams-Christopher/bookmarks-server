const app = require('../src/app');
const apiToken = process.env.API_TOKEN;

const testGETBookmarkId = '7b825ada-b6df-476d-8fd0-adfff18ceab3';
const testDELETEBookmarkID = '8bfff525-476e-4aa4-8679-8c2a180b27ec';
const testUrl = 'http://www.example.com';
const testUrlWithSpace = 'http://www.exam ple.com';
const testUrlWithBadTld = 'http://www.example.invalid';
const testUrlWithIp = 'http://192.168.168.2';
const testUrlWithPort = 'http://www.example.com:1234';
const testUrlSansProtocol = 'www.example.com';

describe.skip('GET endpoints', () => {
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

describe('URL additional validation tests', () => {
    it('should return HTTP status 201 when the POST request is successful (URL with IP address)', () => {
        return supertest(app)
        .post('/bookmarks')
        .set('Authorization', 'Bearer ' + apiToken)
        .send({
            'title': 'Example title',
            'url': testUrlWithIp,
            'description': 'Example description',
            'rating': '5'
        })
        .set('Accept', 'application/json')
        .expect(201)
    });

    it('should return HTTP status 201 when the POST request is successful (URL with port)', () => {
        return supertest(app)
        .post('/bookmarks')
        .set('Authorization', 'Bearer ' + apiToken)
        .send({
            'title': 'Example title',
            'url': testUrlWithPort,
            'description': 'Example description',
            'rating': '5'
        })
        .set('Accept', 'application/json')
        .expect(201)
    });
    
    it('should return HTTP status 201 when the POST request is successful (URL without a protocol)', () => {
        return supertest(app)
        .post('/bookmarks')
        .set('Authorization', 'Bearer ' + apiToken)
        .send({
            'title': 'Example title',
            'url': testUrlSansProtocol,
            'description': 'Example description',
            'rating': '5'
        })
        .set('Accept', 'application/json')
        .expect(201)
    });

    it('should return HTTP status 400 when the POST request is not successful (URL with space)', () => {
        return supertest(app)
        .post('/bookmarks')
        .set('Authorization', 'Bearer ' + apiToken)
        .send({
            'title': 'Example title',
            'url': testUrlWithSpace,
            'description': 'Example description',
            'rating': '5'
        })
        .set('Accept', 'application/json')
        .expect(400)
        .expect({'error': 'Invalid request', 'message': 'The provided URL did not pass validation'});
    });

    it('should return HTTP status 400 when the POST request is not successful (URL with invalid TLD)', () => {
        return supertest(app)
        .post('/bookmarks')
        .set('Authorization', 'Bearer ' + apiToken)
        .send({
            'title': 'Example title',
            'url': testUrlWithBadTld,
            'description': 'Example description',
            'rating': '5'
        })
        .set('Accept', 'application/json')
        .expect(400)
        .expect({'error': 'Invalid request', 'message': 'The provided URL did not pass validation'});
    });
});