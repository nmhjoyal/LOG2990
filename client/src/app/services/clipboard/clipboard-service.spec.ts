import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';
import { Id } from 'src/app/drawing-view/components/tools/assets/tool-constants';
import { NumericalValues } from 'src/AppConstants/NumericalValues';
import { ColorService } from '../color_service/color.service';
import { SelectorService } from '../selector-service/selector-service';
import { ToolHandlerService } from '../tool-handler/tool-handler.service';
import { ClipboardService } from './clipboard-service';

describe('ClipboardService', () => {
  let service: ClipboardService;
  let selectorService: SelectorService;
  let toolService: ToolHandlerService;
  let colorService: ColorService;
  const FIFTY = 50;
  const FORTY = 40;
  const FOUR = 4;
  const THREE = 3;

  beforeEach(() => {
    colorService = new ColorService();
    toolService = new ToolHandlerService(colorService);
    selectorService = new SelectorService();
    service = new ClipboardService(toolService, selectorService);
  });

  it('should be created with correct initialized values', () => {
    expect(service).toBeTruthy();
    expect(service.clipboard).toBeDefined();
    expect(service.lastCursorX).toEqual(0);
    expect(service.lastCursorY).toEqual(0);
    expect(service.pasteOffset).toEqual(0);
  });

  it('should add items to clipboard on copy', () => {
    let drawing: ITools;
    drawing = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    selectorService.selectedObjects.add(drawing);
    service.copy();
    expect(service.clipboard).not.toBeNull();
  });

  it('should add items to clipboard on cut', () => {
    let drawing: ITools;
    drawing = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    selectorService.selectedObjects.add(drawing);
    service.cut();
    expect(service.clipboard.size).toEqual(1);
  });

  it('should remove an item from drawing on delete', () => {
    let drawing: ITools;
    drawing = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    selectorService.selectedObjects.add(drawing);
    toolService.drawings.push(drawing);
    service.delete();
    expect(toolService.drawings.length).toEqual(0);
  });

  it('should remove an item from drawing on cut', () => {
    let drawing: ITools;
    drawing = { x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    selectorService.selectedObjects.add(drawing);
    toolService.drawings.push(drawing);
    service.delete();
    expect(toolService.drawings.length).toEqual(0);
  });

  it('should add drawing to canvas on paste', () => {
    const drawing1 = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    const drawing2 = { x: FORTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    toolService.drawings.push(drawing1);
    toolService.drawings.push(drawing2);
    selectorService.selectedObjects.add(drawing1);
    selectorService.selectedObjects.add(drawing2);
    service.duplicate(); // paste?
    expect(toolService.drawings.length).toEqual(FOUR);
    expect(toolService.drawings[toolService.drawings.length - 1].x).not.toEqual(FORTY);
    expect(toolService.drawings[toolService.drawings.length - 1].y).not.toEqual(FORTY);
  });

  it('should add drawing with offset on paste', () => {
    const drawing = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    toolService.drawings.push(drawing);
    selectorService.selectedObjects.add(drawing);
    service.lastCursorX = FIFTY;
    service.lastCursorY = FORTY;
    service.duplicate();
    expect(toolService.drawings.length).toEqual(2);
    expect(toolService.drawings[toolService.drawings.length - 1].x).toEqual(FIFTY + NumericalValues.DUPLICATE_OFFSET );
    expect(toolService.drawings[toolService.drawings.length - 1].y).toEqual(FORTY + NumericalValues.DUPLICATE_OFFSET );
  });

  it('should change offset multiple duplicates', () => {
    const drawing = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    toolService.drawings.push(drawing);
    selectorService.selectedObjects.add(drawing);
    service.duplicate();
    service.duplicate();
    service.duplicate();
    expect(service.pasteOffset).toEqual(NumericalValues.DUPLICATE_OFFSET * 2);
    expect(toolService.drawings[toolService.drawings.length - 1].x).toEqual(FIFTY + NumericalValues.DUPLICATE_OFFSET * THREE);
    expect(toolService.drawings[toolService.drawings.length - 1].y).toEqual(FORTY + NumericalValues.DUPLICATE_OFFSET * THREE);
  });

  it('should add line drawing to canvas on duplicate', () => {
    const parsedPoints = spyOn(service, 'parsePolylinePoints');
    const drawing1: ITools = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, points: '0,100 50,25', id: Id.LINE };
    const drawing2: ITools = { x: FORTY, y: FORTY, width: FIFTY, height: FIFTY, vertices: '0,0 1,1 0,0', id: Id.ELLIPSE };
    toolService.drawings.push(drawing1);
    toolService.drawings.push(drawing2);
    selectorService.selectedObjects.add(drawing1);
    selectorService.selectedObjects.add(drawing2);
    service.duplicate();
    expect(parsedPoints).toHaveBeenCalled();
    expect(toolService.drawings.length).toEqual(FOUR);
    expect(toolService.drawings[toolService.drawings.length - 1].x).not.toEqual(FORTY);
    expect(toolService.drawings[toolService.drawings.length - 1].y).not.toEqual(FORTY);
  });

  it('should change points of drawing on parsePolylinePoints', () => {
    const drawing1: ITools = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, points: '0,100 50,20', id: Id.LINE };
    const drawing2: ITools = { x: FORTY, y: FORTY, width: FIFTY, height: FIFTY, vertices: '0,0 1,1 0,0', id: Id.POLYGON };

    service.parsePolylinePoints(FIFTY, FIFTY, drawing1);
    expect(drawing1.points).not.toEqual('0,100 50,20');
    service.parsePolylinePoints(FIFTY, FIFTY, drawing2);
    expect(drawing2.vertices).not.toEqual('0,0 1,1 0,0');
  });

  it('should return drawing to initial value if outside of screen', () => {
    const drawing = { x: window.innerWidth, y: window.innerHeight, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    toolService.drawings.push(drawing);
    selectorService.selectedObjects.add(drawing);
    service.duplicate();
    expect(service.pasteOffset).toEqual(NumericalValues.DUPLICATE_OFFSET / 2);
    expect(toolService.drawings[toolService.drawings.length - 1].x).not.toEqual(window.innerWidth);
    expect(toolService.drawings[toolService.drawings.length - 1].y).not.toEqual(window.innerHeight);
  });

  it('should do nothing if no selected objects', () => {
    const drawing: ITools = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    toolService.drawings.push(drawing);
    service.copy();
    expect(service.clipboard.size).toEqual(0);
    service.paste(FIFTY, FIFTY);
    expect(toolService.drawings.length).toEqual(1);
    service.cut();
    expect(toolService.drawings.length).toEqual(1);
  });

  it('should add drawing to canvas on duplicate', () => {
    const drawing1 = { x: FIFTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    const drawing2 = { x: FORTY, y: FORTY, width: FIFTY, height: FIFTY, id: Id.RECTANGLE };
    toolService.drawings.push(drawing1);
    toolService.drawings.push(drawing2);
    selectorService.selectedObjects.add(drawing1);
    selectorService.selectedObjects.add(drawing2);
    service.duplicate();
    expect(toolService.drawings.length).toEqual(FOUR);
    expect(toolService.drawings[toolService.drawings.length - 1].x).not.toEqual(FORTY);
    expect(toolService.drawings[toolService.drawings.length - 1].y).not.toEqual(FORTY);
  });

});
