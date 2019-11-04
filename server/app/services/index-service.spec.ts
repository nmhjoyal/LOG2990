// tslint:disable: no-implicit-dependencies
// tslint:disable: no-require-imports
// tslint:disable: no-var-requires
const server = require('../server');
let chaiImport = require('chai');

describe('IndexService', () => {
    const { expect } = chaiImport;

    describe('server', () => {
        before(() => {
            server.listen(3000);
        });

        after(() => {
            server.close();
        });
    });

    it('#getDrawings should return drawings', function(done) {
        const attribute = this.getDrawings();
        expect(attribute).to.equal(attribute);
        done();
    });

    it('#getDrawing should return drawing', function(done) {
        const drawingTimestampID = '';
        const attribute = this.getDrawing(drawingTimestampID);
        expect(this.getDrawing(drawingTimestampID)).to.equal(attribute);
        done();
    });

    it('#getTags should return tags', function(done) {
        const attribute = this.getTags();
        expect(this.getTags()).to.eql(attribute);
        done();
    });

    it('#dateToId should change date into id', function(done) {
        const date = '00/00/00';
        expect(this.dateToId(date)).to.eql('000000');
        done();
    });
});
