const app = require('../src/app');
const apiToken = process.env.API_TOKEN;

describe('Auuthorization works as expected', () => {
    it('should reject a request with a missing a token', () => {
        return supertest(app)
            .get('/')
            .expect(400)
            .expect('Content-Type', /json/)
            .expect({'error': 'Unauthorized request'});
    });

    it('should reject a request with an incorrect token', () => {
        return supertest(app)   
        .get('/')
        .set('Authorization', 'Bearer invalid_key')
        .expect(400)
        .expect('Content-Type', /json/)
        .expect({'error': 'Unauthorized request'});
    });

    it('should allow a request with the proper token', () => {
        return supertest(app)
        .get('/')
        .set('Authorization', 'Bearer ' + apiToken)
        .expect(200)
    });
});