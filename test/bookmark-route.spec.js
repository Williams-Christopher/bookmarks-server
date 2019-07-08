const app = require('../src/app');
const apiToken = process.env.API_TOKEN;

describe('GET routes', () => {
    it('the /bookmarks route should return all bookmarks test data in JSON format', () => {
        return supertest(app)   
        .get('/bookmarks')
        .set('Authorization', 'Bearer ' + apiToken)
        .expect(200)
        .expect('Content-Type', /json/)
    });

    it('/boomarks/:id returns the specified bookmark test data in JSON format', () => {
        return supertest(app)   
        .get('/bookmarks/1')
        .set('Authorization', 'Bearer ' + apiToken)
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
            expect(res.body).to.be.an('object')
            expect(res.body).to.include.all.keys('id', 'title', 'url', 'description', 'rating')
        });
    });

    it('/bookmarks/:id returns a 404 when an invalid book mark id is requested', () => {
        return supertest(app)
        .get('/bookmarks/invalid')
        .set('Authorization', 'Bearer ' + apiToken)
        .expect(404);
    });
});