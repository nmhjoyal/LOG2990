// tslint:disable: no-implicit-dependencies
// tslint:disable: no-require-imports
// tslint:disable: no-var-requires
// tslint:disable: no-any
const server = require('../server');
const http = require('http');
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../server');
import { expect } from 'chai';

chai.use(chaiHttp);
chai.should();

describe('IndexController', () => {
    describe('server', () => {
        before(() => {
            server.listen(3000);

        });

        after(() => {
            server.close();
        });
    });

    describe('/', () => {
        it('should return 200', (done: Mocha.Done) => {
            chai.request(app).get('/').end((res: any) => {
                res.should.have.status(200);
            });
        });
    });

    describe('/save', () => {
        it('call index.saveTag', () => {
            http.get('http://localhost:3000/save', (res: any) => {
                // assert.equal(res, index.saveTag({ name: 'string', isSelected: false }));
                chai.done();
            });
        });
    });

    describe('/tags', () => {
        it('call index.saveTag', () => {
            http.get('http://localhost:3000/tags', (res: any) => {
                // tslint:disable-next-line: no-unused-expression
                expect(res).to.be.true;
            });
        });
    });

    describe('/gettags', () => {
        it('call index.saveTag', () => {
            chai.request(app).get('/gettags').end((res: any) => {
                res.should.have.status(200);
            });

        });
    });

});
