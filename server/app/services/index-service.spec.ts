
// tslint:disable: no-implicit-dependencies
import { assert, expect } from 'chai';
import { ICanvasData } from '../../../client/src/app/services/canvas-information/ICanvasData';
import { IDrawing } from '../../../common/drawing-information/IDrawing';
import { ISVGPreview } from '../../../common/drawing-information/ISVGPreview';
import { ITag } from '../../../common/drawing-information/ITag';
import { IndexService } from '../services/index.service';

describe('IndexService', () => {
    let service: IndexService;

    beforeEach( () => {
         service = new IndexService();
    });

    it('Should convert the timestamp in an id', (done: Mocha.Done) => {
        const date = '12/12/2019 - 12:40:45';
        const id = '12122019124045';
        assert(service.dateToId(date) === id);
        done();
    });

    it('Should save the Drawing with a valid name', (done: Mocha.Done) => {
        const date = new Date().toLocaleString('en-GB', { timeZone: 'UTC' });
        // tslint:disable-next-line:max-line-length
        const drawingToSave: IDrawing = { name: 'name', preview: {} as ISVGPreview, timestamp: date, shapes: [], canvas: {} as ICanvasData };
        service.saveDrawing(drawingToSave).then((response) => {
            assert(response);
            assert(service.drawingsInGallery.has(service.dateToId(date)));
        }).catch();
        done();
    });

    it('Should not save a Drawing with no name', (done: Mocha.Done) => {
        const date = new Date().toLocaleString('en-GB', { timeZone: 'UTC' });
        // tslint:disable-next-line:max-line-length
        const drawingToSave: IDrawing = { name: '', preview: {} as ISVGPreview, timestamp: date, shapes: [], canvas: {} as ICanvasData };
        service.saveDrawing(drawingToSave).then((response) => {
            assert(!response);
            assert(!service.drawingsInGallery.has(service.dateToId(date)));
        }).catch();
        done();
    });

    it('Should not save a Drawing with no timestamp', (done: Mocha.Done) => {
        const date = new Date().toLocaleString('en-GB', { timeZone: 'UTC' });
        // tslint:disable-next-line:max-line-length
        const drawingToSave: IDrawing = { name: '', preview: {} as ISVGPreview, timestamp: '', shapes: [], canvas: {} as ICanvasData };
        service.saveDrawing(drawingToSave).then((response) => {
            assert(!response);
            assert(!service.drawingsInGallery.has(service.dateToId(date)));
        }).catch();
        done();
    });

    it('Should save the new tag', (done: Mocha.Done) => {
        const tagToSave: ITag = {name: 'tag1', isSelected: true};
        service.saveTag(tagToSave).then((response) => {
            assert(response);
            assert(service.tags.includes(tagToSave));
        }).catch();
        done();
    });

    it('Should not save a tag more than once', (done: Mocha.Done) => {
        const tagToSave: ITag = {name: 'tag1', isSelected: true};
        service.saveTag(tagToSave).then((res) => {
            assert(res);
            service.saveTag(tagToSave).then((response) => {
                assert(!response);
                assert(service.tags.length === 1);
            }).catch();
        }).catch();
        done();
    });

    it('Should return the drawings in the gallery', (done: Mocha.Done) => {
        const date = new Date().toLocaleString('en-GB', { timeZone: 'UTC' });
        // tslint:disable-next-line:max-line-length
        const drawingToSave: IDrawing = { name: 'name', preview: {} as ISVGPreview, timestamp: date, shapes: [], canvas: {} as ICanvasData };
        service.saveDrawing(drawingToSave).then((res) => {
            assert(res);
            service.getDrawings().then((response) => {
                expect(response === [drawingToSave]);
            }).catch();
            // assert(service.drawingsInGallery.has(service.dateToId(date)));
        }).catch();
        done();
    });

    it('Should return the drawing requested', (done: Mocha.Done) => {
        const date = new Date().toLocaleString('en-GB', { timeZone: 'UTC' });
        // tslint:disable-next-line:max-line-length
        const drawingToSave: IDrawing = { name: 'name', preview: {} as ISVGPreview, timestamp: date, shapes: [], canvas: {} as ICanvasData };
        service.saveDrawing(drawingToSave).then((res) => {
            assert(res);
            service.getDrawing(service.dateToId(date)).then((response) => {
                expect(response === drawingToSave);
            }).catch();
            // assert(service.drawingsInGallery.has(service.dateToId(date)));
        }).catch();
        done();
    });

    it('Should return tags', (done: Mocha.Done) => {
        const tagToSave: ITag = {name: 'tag1', isSelected: true};
        service.saveTag(tagToSave).then((res) => {
            assert(res);
            service.getTags().then((response) => {
                expect(service.tags === [tagToSave]);
            }).catch();
            // assert(service.tags.includes(tagToSave));
        }).catch();
        done();
    });

});
