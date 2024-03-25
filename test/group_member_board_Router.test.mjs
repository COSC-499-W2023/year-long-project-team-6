// Import chai and chaiHttp
import * as chai from 'chai';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);

// Enable should style assertions
const should = chai.should();

// Dynamically import your app assuming it's an ES Module or adapted for ES Module syntax
let app;
before(async () => {
    app = (await import('../app/backend/server.js')).default;
});
describe('Group Routes', () => {

    describe('GET /groups-users/:groupId', () => {
        it('it should GET all users of a group', (done) => {
            const groupId = '40';
            chai.request(app)
                .get(`/groups-users/${groupId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    // Add more assertions here based on the structure of your users
                    done();
                });
        });
    });

    describe('GET /group-admin/:groupId', () => {
        it('it should GET the admin of the group', (done) => {
            const groupId = '40';
            chai.request(app)
                .get(`/group-admin/${groupId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    // Assuming 'admin' is an object with certain properties
                    res.body.should.be.a('object');
                    // Add more assertions here based on the structure of your admin object
                    done();
                });
        });
    });

    describe('GET /user-details/:userId', () => {
        it('it should GET the details of a user', (done) => {
            const userId = '50';
            chai.request(app)
                .get(`/user-details/${userId}`)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

});
