const chai = require('chai')
const chaiHttp = require('chai-http');
const server = require('../main');  // TODO : rempalcer par le nom de votre script principal
const should = chai.should();

chai.use(chaiHttp);

describe('JWT Authentication', () => {
    let token = '';

    // Connexion à l'API pour récupérer le token JWT
    before((done) => {
        chai.request(server)
            .post('/useraccount/authenticate') // TODO : remplacer par votre URL d'authentification
            .send({ login: 'user1', password: 'default' }) // TODO : remplacer par les champs attendus par votre route
            .end((err, res) => {
                res.should.have.status(200);
                token = res.body.token;
                done();
            });
    });

    // Test avec un token JWT valide
    it('should allow access with valid token', (done) => {
        chai.request(server)
            .get('/car') // TODO : remplacer par une de vos routes protégée par validateJWT
            .set('Authorization', `Bearer ${token}`)
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array'); // TODO : remplacer array par object si votre route retourne un objet
                done();
            });
    });

    // Test avec un token JWT non valide
    it('should deny access with invalid token', (done) => {
        chai.request(server)
            .get('/car') // TODO : remplacer par une de vos routes protégée par validateJWT
            .set('Authorization', 'Bearer wrongtoken')
            .end((err, res) => {
                res.should.have.status(401);
                done();
            });
    });
});
