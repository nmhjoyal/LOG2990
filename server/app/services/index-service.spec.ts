// tslint:disable: no-implicit-dependencies
// tslint:disable: no-require-imports
// tslint:disable: no-var-requires
import { IDrawing } from '../../../common/drawing-information/IDrawing';
import { ITag } from '../../../common/drawing-information/ITag';
import { IndexService } from '../services/index.service';
const server = require('../server');
const assert = require('assert');
const http = require('http');
const chai = require('chai');

describe('IndexService', () => {
    let service: IndexService;
    const { expect } = chai;
    const should = require('chai').should();

    describe('server', () => {
        before(() => {
            server.listen(3000);
        });

        after(() => {
            server.close();
        });
    });

    /* Test */

    it('#savedrawing should return true if drawing is valid', function(done) {
        const drawingToSave: IDrawing = new IDrawing();
        const attribute = this.saveDrawing(drawingToSave);
        expect(attribute).to.return(true);
        done();
    });

    it('#savedrawing should return false if drawing is invalid', function(done) {
        const drawingToSave: IDrawing = new IDrawing();
        const attribute = this.saveDrawing(drawingToSave);
        expect(attribute).to.return(false);
        done();
    });

    it('#saveTag should return true if tag is valid', function(done) {
        const drawingToSave: ITag = new ITag();
        const attribute = this.saveTag(drawingToSave);
        expect(attribute).to.return(true);
        done();
    });

    it('#savetag should return false if tag is invalid', function(done) {
        const drawingToSave: ITag = new ITag();
        const attribute = this.saveTag(drawingToSave);
        expect(attribute).to.return(false);
        done();
    });

    it('#getDrawings should return drawings', function(done) {
        const attribute = this.getDrawings();
        expect(attribute).to.return(attribute);
        done();
    });

    it('#getDrawing should return drawing', function(done) {
        const drawingTimestampID = '';
        const attribute = this.getDrawing(drawingTimestampID);
        expect(this.getDrawing(drawingTimestampID)).to.return(attribute);
        done();
    });

    it('#getTags should return tags', function(done) {
        const attribute = this.getTags();
        expect(this.getTags()).to.return(attribute);
        done();
    });

    it('#dateToId should change date into id', function(done) {
        const date = '00/00/00';
        expect(this.dateToId(date)).to.return('000000');
        done();
    });
});
