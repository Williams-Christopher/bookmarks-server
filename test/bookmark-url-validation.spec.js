const app = require('../src/app');
const apiToken = process.env.API_TOKEN;
const { makeTestUrls } = require('./bookmarks.fixtures');

describe('URL validation tests', () => {
    const testUrls = makeTestUrls();

    it('should return HTTP status 201 when the POST request is successful (URL with IP address)', () => {
        return supertest(app)
        .post('/api/bookmarks')
        .set('Authorization', 'Bearer ' + apiToken)
        .send({
            'title': 'Example title',
            'url': testUrls.testUrlWithIp,
            'description': 'Example description',
            'rating': '5'
        })
        .set('Accept', 'application/json')
        .expect(201)
    });

    it('should return HTTP status 201 when the POST request is successful (URL with port)', () => {
        return supertest(app)
        .post('/api/bookmarks')
        .set('Authorization', 'Bearer ' + apiToken)
        .send({
            'title': 'Example title',
            'url': testUrls.testUrlWithPort,
            'description': 'Example description',
            'rating': '5'
        })
        .set('Accept', 'application/json')
        .expect(201)
    });
    
    it('should return HTTP status 201 when the POST request is successful (URL without a protocol)', () => {
        return supertest(app)
        .post('/api/bookmarks')
        .set('Authorization', 'Bearer ' + apiToken)
        .send({
            'title': 'Example title',
            'url': testUrls.testUrlSansProtocol,
            'description': 'Example description',
            'rating': '5'
        })
        .set('Accept', 'application/json')
        .expect(201)
    });

    it('should return HTTP status 400 when the POST request is not successful (URL with space)', () => {
        return supertest(app)
        .post('/api/bookmarks')
        .set('Authorization', 'Bearer ' + apiToken)
        .send({
            'title': 'Example title',
            'url': testUrls.testUrlWithSpace,
            'description': 'Example description',
            'rating': '5'
        })
        .set('Accept', 'application/json')
        .expect(400)
        .expect({'error': 'Invalid request', 'message': 'The provided URL did not pass validation'});
    });

    it('should return HTTP status 400 when the POST request is not successful (URL with invalid TLD)', () => {
        return supertest(app)
        .post('/api/bookmarks')
        .set('Authorization', 'Bearer ' + apiToken)
        .send({
            'title': 'Example title',
            'url': testUrls.testUrlWithBadTld,
            'description': 'Example description',
            'rating': '5'
        })
        .set('Accept', 'application/json')
        .expect(400)
        .expect({'error': 'Invalid request', 'message': 'The provided URL did not pass validation'});
    });
});