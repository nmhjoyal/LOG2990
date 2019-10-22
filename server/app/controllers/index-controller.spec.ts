// tslint:disable: no-implicit-dependencies
// tslint:disable: no-require-imports
// tslint:disable: no-var-requires
// tslint:disable: no-var-requires
import { IndexService } from '../services/index.service';
const server = require('../server');
const assert = require('assert');
const http = require('http');
const chai = require('chai');
import {expect} from 'chai';


// tslint:disable-next-line: no-implicit-dependencies
describe('IndexController', () => {
    let index: IndexService;

    describe('server', () => {
        before(() => {
            server.listen(3000);
            index = new IndexService();
        });

        after(() => {
            server.close();
        });
    });

    describe('/', () => {
        it('should return 200', (done: Mocha.Done) => {
            http.get('http://localhost:3000', (res: any) => {
                assert.equal(200, res.statusCode);
                chai.done();
            });
        });
    });

    describe('/save', () => {
        it('call index.saveTag', (res: any) => {
            http.get('http://localhost:3000/save', (res: any) => {
                assert.equal(res, index.saveTag({ name: 'string', isSelected: false }));
                chai.done();
            });
        });
    });

    describe('/tags', () => {
        it('call index.saveTag', (res: any) => {
            http.get('http://localhost:3000/tags', (res: any) => {
               expect(res).to.be.a('ITag[]');
            });
        });
    });

});
