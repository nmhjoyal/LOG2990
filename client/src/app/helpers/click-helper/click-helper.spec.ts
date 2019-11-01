import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { Id } from 'src/app/drawing-view/components/tools/assets/tool-constants';
import ClickHelper from './click-helper';

describe('ClickHelper', () => {
    const FIFTY = 50;
    const FORTY = 40;
    const ONE_HUNDRED = 100;
    const TWICE = 2;

    it('should return proper cursor position relative to parent', () => {
        const move = new MouseEvent('mousemove');
        expect(ClickHelper.getXPosition(move)).toEqual(0);
        expect(ClickHelper.getYPosition(move)).toEqual(0);
    });

    it('should confirm cursor touches object border', () => {
        let object: ITools = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
        expect(ClickHelper.cursorTouchesObjectBorder(object, FIFTY, FIFTY)).toBeTruthy();
        expect(ClickHelper.cursorTouchesObjectBorder(object, FORTY, FORTY)).toBeFalsy();
        object = { x: 0, y: 0, width: 0, height: 0, id: Id.CRAYON, points: '50,50 50,51 51,50 51,51' };
        expect(ClickHelper.cursorTouchesObjectBorder(object, FIFTY, FIFTY)).toBeTruthy();
        expect(ClickHelper.cursorTouchesObjectBorder(object, FORTY, FORTY)).toBeFalsy();
        object = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.ELLIPSE };
        expect(ClickHelper.cursorTouchesObjectBorder(object, FORTY, FORTY)).toBeFalsy();
        expect(ClickHelper.cursorTouchesObjectBorder(object, FIFTY, ONE_HUNDRED)).toBeTruthy();
        object = { x: ONE_HUNDRED, y: ONE_HUNDRED, width: 3, height: 3, id: Id.POLYGON,
            vertices: '100,100 99,99 98,98 99,97 100,96 101,97 102,98 101,99' };
        expect(ClickHelper.cursorTouchesObjectBorder(object, ONE_HUNDRED, ONE_HUNDRED)).toBeTruthy();
        expect(ClickHelper.cursorTouchesObjectBorder(object, FORTY, FORTY)).toBeFalsy();
        object = { x: FORTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.STAMP };
        expect(ClickHelper.cursorTouchesObjectBorder(object, FIFTY, FIFTY)).toBeFalsy();
        expect(ClickHelper.cursorTouchesObjectBorder(object, FORTY, (FORTY + (FIFTY / TWICE)))).toBeTruthy();
        object = { x: 0, y: 0, width: 0, height: 0, id: 'none' };
        expect(ClickHelper.cursorInsideObject(object, 0, 0)).toBeFalsy();
    });

    it('should confirm cursor inside object', () => {
        let object: ITools = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
        expect(ClickHelper.cursorInsideObject(object, FIFTY, FIFTY)).toBeTruthy();
        expect(ClickHelper.cursorInsideObject(object, FORTY, FORTY)).toBeFalsy();
        object = { x: 0, y: 0, width: 0, height: 0, id: Id.CRAYON, points: '50,50 50,51 51,50 51,51' };
        expect(ClickHelper.cursorInsideObject(object, FIFTY, FIFTY)).toBeTruthy();
        expect(ClickHelper.cursorInsideObject(object, FORTY, FORTY)).toBeFalsy();
        object = { x: FIFTY / TWICE, y: FIFTY / TWICE, width: FIFTY / TWICE, height: FIFTY / TWICE, id: Id.ELLIPSE };
        expect(ClickHelper.cursorInsideObject(object, FIFTY, FIFTY)).toBeFalsy();
        expect(ClickHelper.cursorInsideObject(object, FORTY, FORTY)).toBeTruthy();
        object = { x: ONE_HUNDRED, y: ONE_HUNDRED, width: 3, height: 3, id: Id.POLYGON,
            vertices: '100,100 99,99 98,98 99,97 100,96 101,97 102,98 101,99' };
        expect(ClickHelper.cursorInsideObject(object, ONE_HUNDRED, ONE_HUNDRED)).toBeTruthy();
        expect(ClickHelper.cursorInsideObject(object, FORTY, FORTY)).toBeFalsy();
        object = { x: FORTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.STAMP };
        expect(ClickHelper.cursorInsideObject(object, FIFTY, FIFTY)).toBeTruthy();
        expect(ClickHelper.cursorInsideObject(object, FORTY, FORTY)).toBeFalsy();
        object = { x: 0, y: 0, width: 0, height: 0, id: 'none' };
        expect(ClickHelper.cursorInsideObject(object, FORTY, FORTY)).toBeFalsy();
    });

    it('should confirm selection box intersects object', () => {
        let object: ITools = { x: FIFTY, y: FIFTY, width: FORTY, height: FORTY, id: Id.RECTANGLE };
        let box = { x: ONE_HUNDRED, y: ONE_HUNDRED, width: FORTY, height: FORTY };
        expect(ClickHelper.objectSharesBoxArea(object, box)).toBeFalsy();
        object = { x: 0, y: 0, width: 0, height: 0, id: Id.CRAYON, points: '40,40' };
        expect(ClickHelper.objectSharesBoxArea(object, box)).toBeFalsy();
        object = { x: FIFTY / TWICE, y: FIFTY / TWICE, width: FORTY / TWICE, height: FORTY / TWICE, id: Id.ELLIPSE };
        expect(ClickHelper.objectSharesBoxArea(object, box)).toBeFalsy();
        object = { x: 10, y: 10, width: 3, height: 3, id: Id.POLYGON,
            vertices: '10,10 9,9 8,8 9,7 10,6 11,7 12,8 11,9' };
        expect(ClickHelper.objectSharesBoxArea(object, box)).toBeFalsy();
        object = { x: FIFTY, y: FIFTY, width: FORTY, height: FORTY, id: Id.STAMP };
        expect(ClickHelper.objectSharesBoxArea(object, box)).toBeFalsy();
        object = { x: 0, y: 0, width: 0, height: 0, id: 'none' };
        expect(ClickHelper.objectSharesBoxArea(object, box)).toBeFalsy();
        box = { x: FORTY, y: FORTY, width: ONE_HUNDRED, height: ONE_HUNDRED };
        object = { x: FIFTY, y: FIFTY, width: FORTY, height: FORTY, id: Id.RECTANGLE };
        expect(ClickHelper.objectSharesBoxArea(object, box)).toBeTruthy();
        object = { x: 0, y: 0, width: 0, height: 0, id: Id.CRAYON, points: '40,40 40,41 41,40 41,41' };
        expect(ClickHelper.objectSharesBoxArea(object, box)).toBeTruthy();
        object = { x: FIFTY, y: FIFTY, width: FORTY, height: FORTY, id: Id.ELLIPSE };
        expect(ClickHelper.objectSharesBoxArea(object, box)).toBeTruthy();
        object = { x: ONE_HUNDRED, y: ONE_HUNDRED, width: 3, height: 3, id: Id.POLYGON,
            vertices: '100,100 99,99 98,98 99,97 100,96 101,97 102,98 101,99' };
        expect(ClickHelper.objectSharesBoxArea(object, box)).toBeTruthy();
        object = { x: FIFTY, y: FIFTY, width: FORTY, height: FORTY, id: Id.STAMP };
        expect(ClickHelper.objectSharesBoxArea(object, box)).toBeTruthy();
    });
});
