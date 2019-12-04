import { ControlPoints } from 'src/app/drawing-view/components/tools/assets/constants/selector-constants';
import { Id } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { CanvasInformationService } from '../canvas-information/canvas-information.service';
import { DrawingStorageService } from '../drawing-storage/drawing-storage.service';
import { SaveService } from '../save-service/save.service';
import { SelectorService } from '../selector-service/selector-service';
import { UndoRedoService } from '../undo-redo/undo-redo.service';
import { ResizeService } from './resize-service';

describe('SelectorService', () => {
    let selectorService: SelectorService;
    let service: ResizeService;
    const canvasInformation: CanvasInformationService = new CanvasInformationService();
    const drawingStorage: DrawingStorageService = new DrawingStorageService();
    const undoRedo: UndoRedoService = new UndoRedoService(drawingStorage, canvasInformation);
    const saveService: SaveService = new SaveService(drawingStorage, undoRedo);
    const FIFTY = 50;
    const FORTY = 40;
    const ONE_HUNDRED = 100;
    let rect: ITools;
    let ellipse: ITools;
    let line: ITools;
    let pen: ITools;
    let polygon: ITools;
    const expectedDifference = 10;

    beforeEach(() => {
        selectorService = new SelectorService(saveService);
        service = new ResizeService(selectorService);
        // tslint:disable: no-any - to verify coordinates/dimensions are being correctly changed and be able to set
        // custom test data
        (service as any).selectorService.selectedObjects = [
            { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE },
            { x: ONE_HUNDRED, y: ONE_HUNDRED, width: FORTY, height: FORTY, id: Id.ELLIPSE },
            { x: ONE_HUNDRED, y: ONE_HUNDRED, width: FORTY, height: FORTY, id: Id.POLYGON, vertices: '100,80 80,120 120,120',
            scaleX: 1, scaleY: 1 },
            { x: FIFTY, y: FIFTY, width: 2, height: 2, id: Id.CRAYON, points: '50,50 50,51 51,50 51,51', scaleX: 1, scaleY: 1 },
            { x: FIFTY, y: FIFTY, width: 2, height: 2, id: Id.PEN, paths: [{path: 'M50 50L50 51', pathWidth: 1},
            {path: 'M51 50L51 51', pathWidth: 1}], scaleX: 1, scaleY: 1 },
        ];
        (service as any).selectorService.recalculateShape(ONE_HUNDRED * 2, ONE_HUNDRED * 2);
        rect = (service as any).selectorService.selectedObjects[0];
        ellipse = (service as any).selectorService.selectedObjects[1];
        polygon = (service as any).selectorService.selectedObjects[2];
        // tslint:disable: no-magic-numbers
        line = (service as any).selectorService.selectedObjects[3];
        pen = (service as any).selectorService.selectedObjects[4];
    });

    it('should resize position of shapes', () => {
        service.cursorPosition = { x: FORTY, y: FORTY };
        service.resizePosition();
        expect(rect.x).toEqual(FIFTY - expectedDifference);
        expect(rect.y).toEqual(FIFTY - expectedDifference);
        expect(rect.width).toEqual(FIFTY + expectedDifference);
        expect(rect.height).toEqual(FIFTY + expectedDifference);

        expect(ellipse.x).toEqual(ONE_HUNDRED - (expectedDifference / 2));
        expect(ellipse.y).toEqual(ONE_HUNDRED - (expectedDifference / 2));
        expect(ellipse.width).toEqual(FORTY + (expectedDifference / 2));
        expect(ellipse.height).toEqual(FORTY + (expectedDifference / 2));

        expect(polygon.x).toEqual(ONE_HUNDRED - (expectedDifference / 2));
        expect(polygon.y).toEqual(ONE_HUNDRED - (expectedDifference / 2));
        expect(polygon.width).toEqual(FORTY + (expectedDifference / 2));
        expect(polygon.height).toEqual(FORTY + (expectedDifference / 2));
        expect(polygon.scaleX).toEqual(1 + (expectedDifference / (FORTY * 2)));
        expect(polygon.scaleY).toEqual(1 + (expectedDifference / (FORTY * 2)));

        expect(line.x).toEqual(FIFTY - expectedDifference);
        expect(line.y).toEqual(FIFTY - expectedDifference);
        expect(line.width).toEqual(2 + expectedDifference);
        expect(line.height).toEqual(2 + expectedDifference);
        expect(line.scaleX).toEqual(1 + (expectedDifference / 2));
        expect(line.scaleY).toEqual(1 + (expectedDifference / 2));

        expect(pen.x).toEqual(FIFTY - expectedDifference);
        expect(pen.y).toEqual(FIFTY - expectedDifference);
        expect(pen.width).toEqual(2 + expectedDifference);
        expect(pen.height).toEqual(2 + expectedDifference);
        expect(pen.scaleX).toEqual(1 + (expectedDifference / 2));
        expect(pen.scaleY).toEqual(1 + (expectedDifference / 2));
    });

    it('should resize axes of shapes', () => {
        service.cursorPosition = { x: ONE_HUNDRED + FIFTY, y: ONE_HUNDRED + FIFTY };
        service.resizeAxis();
        expect(rect.x).toEqual(FIFTY);
        expect(rect.y).toEqual(FIFTY);
        expect(rect.width).toEqual(FIFTY + expectedDifference);
        expect(rect.height).toEqual(FIFTY + expectedDifference);

        expect(ellipse.x).toEqual(ONE_HUNDRED + (expectedDifference / 2));
        expect(ellipse.y).toEqual(ONE_HUNDRED + (expectedDifference / 2));
        expect(ellipse.width).toEqual(FORTY + (expectedDifference / 2));
        expect(ellipse.height).toEqual(FORTY + (expectedDifference / 2));

        expect(line.x).toEqual(FIFTY);
        expect(line.y).toEqual(FIFTY);
        expect(line.width).toEqual(2 + expectedDifference);
        expect(line.height).toEqual(2 + expectedDifference);
        expect(line.scaleX).toEqual(1 + (expectedDifference / 2));
        expect(line.scaleY).toEqual(1 + (expectedDifference / 2));
    });

    it('should resize with aspect ratio - bottom right', () => {
        service.cursorPosition = { x: ONE_HUNDRED + FIFTY, y: ONE_HUNDRED + FIFTY };
        service.resizeWithAspectRatio(ControlPoints.BOTTOM_RIGHT);
        expect(rect.x).toEqual(FIFTY);
        expect(rect.y).toEqual(FIFTY);
        expect(rect.width).toEqual(FIFTY + expectedDifference);
        expect(rect.height).toEqual(FIFTY + expectedDifference);

        expect(ellipse.x).toEqual(ONE_HUNDRED + (expectedDifference / 2));
        expect(ellipse.y).toEqual(ONE_HUNDRED + (expectedDifference / 2));
        expect(ellipse.width).toEqual(FORTY + (expectedDifference / 2));
        expect(ellipse.height).toEqual(FORTY + (expectedDifference / 2));

        expect(line.x).toEqual(FIFTY);
        expect(line.y).toEqual(FIFTY);
        expect(line.width).toEqual(2 + expectedDifference);
        expect(line.height).toEqual(2 + expectedDifference);
        expect(line.scaleX).toEqual(1 + (expectedDifference / 2));
        expect(line.scaleY).toEqual(1 + (expectedDifference / 2));
    });

    it('should resize with aspect ratio - bottom left', () => {
        service.cursorPosition = { x: FORTY, y: ONE_HUNDRED + FIFTY };
        service.resizeWithAspectRatio(ControlPoints.BOTTOM_LEFT);
        expect(rect.x).toEqual(FIFTY - expectedDifference);
        expect(rect.y).toEqual(FIFTY);
        expect(rect.width).toEqual(FIFTY + expectedDifference);
        expect(rect.height).toEqual(FIFTY + expectedDifference);

        expect(ellipse.x).toEqual(ONE_HUNDRED - (expectedDifference / 2));
        expect(ellipse.y).toEqual(ONE_HUNDRED + (expectedDifference / 2));
        expect(ellipse.width).toEqual(FORTY + (expectedDifference / 2));
        expect(ellipse.height).toEqual(FORTY + (expectedDifference / 2));

        expect(line.x).toEqual(FIFTY - expectedDifference);
        expect(line.y).toEqual(FIFTY);
        expect(line.width).toEqual(2 + expectedDifference);
        expect(line.height).toEqual(2 + expectedDifference);
        expect(line.scaleX).toEqual(1 + (expectedDifference / 2));
        expect(line.scaleY).toEqual(1 + (expectedDifference / 2));
    });

    it('should resize with aspect ratio - top right', () => {
        service.cursorPosition = { x: ONE_HUNDRED + FIFTY, y: FORTY };
        service.resizeWithAspectRatio(ControlPoints.TOP_RIGHT);
        expect(rect.x).toEqual(FIFTY);
        expect(rect.y).toEqual(FIFTY - expectedDifference);
        expect(rect.width).toEqual(FIFTY + expectedDifference);
        expect(rect.height).toEqual(FIFTY + expectedDifference);

        expect(ellipse.x).toEqual(ONE_HUNDRED + (expectedDifference / 2));
        expect(ellipse.y).toEqual(ONE_HUNDRED - (expectedDifference / 2));
        expect(ellipse.width).toEqual(FORTY + (expectedDifference / 2));
        expect(ellipse.height).toEqual(FORTY + (expectedDifference / 2));

        expect(line.x).toEqual(FIFTY);
        expect(line.y).toEqual(FIFTY - expectedDifference);
        expect(line.width).toEqual(2 + expectedDifference);
        expect(line.height).toEqual(2 + expectedDifference);
        expect(line.scaleX).toEqual(1 + (expectedDifference / 2));
        expect(line.scaleY).toEqual(1 + (expectedDifference / 2));
    });

    it('should resize with aspect ratio - top left', () => {
        service.cursorPosition = { x: FORTY, y: FORTY };
        service.resizeWithAspectRatio(ControlPoints.TOP_LEFT);
        expect(rect.x).toEqual(FIFTY - expectedDifference);
        expect(rect.y).toEqual(FIFTY - expectedDifference);
        expect(rect.width).toEqual(FIFTY + expectedDifference);
        expect(rect.height).toEqual(FIFTY + expectedDifference);

        expect(ellipse.x).toEqual(ONE_HUNDRED - (expectedDifference / 2));
        expect(ellipse.y).toEqual(ONE_HUNDRED - (expectedDifference / 2));
        expect(ellipse.width).toEqual(FORTY + (expectedDifference / 2));
        expect(ellipse.height).toEqual(FORTY + (expectedDifference / 2));

        expect(line.x).toEqual(FIFTY - expectedDifference);
        expect(line.y).toEqual(FIFTY - expectedDifference);
        expect(line.width).toEqual(2 + expectedDifference);
        expect(line.height).toEqual(2 + expectedDifference);
        expect(line.scaleX).toEqual(1 + (expectedDifference / 2));
        expect(line.scaleY).toEqual(1 + (expectedDifference / 2));
    });

    it('should not resize with aspect ratio if control point not corner', () => {
        service.cursorPosition = { x: FORTY, y: FIFTY };
        service.resizeWithAspectRatio(ControlPoints.MIDDLE_LEFT);
        // rect unchanged
        expect(rect.x).toEqual(FIFTY);
        expect(rect.y).toEqual(FIFTY);
        expect(rect.width).toEqual(FIFTY);
        expect(rect.height).toEqual(FIFTY);
    });

    it('should resize from center of shapes', () => {
        service.cursorPosition = { x: ONE_HUNDRED + FIFTY, y: ONE_HUNDRED + FIFTY };
        service.resizeAxesFromCenter();
        expect(rect.x).toEqual(FIFTY - expectedDifference);
        expect(rect.y).toEqual(FIFTY - expectedDifference);
        expect(rect.width).toEqual(FIFTY + expectedDifference * 2);
        expect(rect.height).toEqual(FIFTY + expectedDifference * 2);

        expect(ellipse.x).toEqual(ONE_HUNDRED);
        expect(ellipse.y).toEqual(ONE_HUNDRED);
        expect(ellipse.width).toEqual(FORTY + expectedDifference);
        expect(ellipse.height).toEqual(FORTY + expectedDifference);

        expect(line.x).toEqual(FIFTY - expectedDifference);
        expect(line.y).toEqual(FIFTY - expectedDifference);
        expect(line.width).toEqual(2 + (expectedDifference * 2));
        expect(line.height).toEqual(2 + (expectedDifference * 2));
        expect(line.scaleX).toEqual(1 + (expectedDifference / (expectedDifference + 2)));
        expect(line.scaleY).toEqual(1 + (expectedDifference / (expectedDifference + 2)));
    });
});
