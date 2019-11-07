import { TestBed } from '@angular/core/testing';
import { ToolConstants } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { Strings } from 'src/AppConstants/Strings';
import { ColorService } from '../color_service/color.service';
import { ToolHandlerService } from './tool-handler.service';
import { DrawingStorageService } from '../drawing-storage/drawing-storage.service';
import { IShape } from 'src/app/drawing-view/components/tools/assets/interfaces/shape-interface';
import { ITools } from 'src/app/drawing-view/components/tools/assets/interfaces/itools';

describe('ToolHandlerService', () => {
  let service: ToolHandlerService;
  let colorService: ColorService;
  let drawingServiceMock: jasmine.SpyObj<DrawingStorageService> = jasmine.createSpyObj('drawingServiceMock',
   ['saveDrawing', 'seeDrawings', 'seeSelection', 'emptyDrawings', 'resetSelectorBox', 'saveSelectorBox', 'selectorBoxExists']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[
        {provide: DrawingStorageService, useValue: drawingServiceMock, },
      ],
    });
    service = TestBed.get(ToolHandlerService);
    colorService = TestBed.get(ColorService);

  });

  it('should be created with correct initialized values', () => {
    expect(service).toBeTruthy();

    expect(service.selectedTool).toBe(ToolConstants.TOOL_ID.NONE);
    expect(service.primaryColorSelected).toBe(false);
    expect(service.secondaryColorSelected).toBe(false);
    expect(service.primaryColor).toEqual(colorService.color[0]);
    expect(service.secondaryColor).toEqual(colorService.color[1]);
  });

  it('#secondaryColor should properly access the secondary color', () => {
      const color = colorService.color[1];
      expect(color).toBe( colorService.color[1]);
  });

  it('#primaryColor should propely access the primary color', () => {
      const color = colorService.color[0];
      expect(color).toBe( colorService.color[0]);
  });

  it('#resetSelection should reset all tool selections to false and set noneSelected to true', () => {
      spyOn(service, 'resetSelectorBox').and.callThrough();
      service.resetSelection();

      expect(service.selectedTool).toBe(ToolConstants.TOOL_ID.NONE);
      expect(service.primaryColorSelected).toBe(false);
      expect(service.secondaryColorSelected).toBe(false);
      expect(service.resetSelectorBox).toHaveBeenCalled();
  });

  it('#clearPage should call #resetSelection and #emptyDrawings', () => {
    const emptySpy = spyOn(service, 'emptyDrawings');
    const resetSpy = spyOn(service, 'resetSelectorBox');
    service.clearPage();

    expect(emptySpy).toHaveBeenCalled();
    expect(resetSpy).toHaveBeenCalled();
  });

  it('#saveDrawing should call the drawingStorage method', () => {
    const dummyDrawing: ITools = {
      id: '',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
    service.saveDrawing(dummyDrawing);
    expect(drawingServiceMock.saveDrawing).toHaveBeenCalled();
  });

  it('#seeDrawings should call the drawingStorage method', () => {
    service.seeDrawings();
    expect(drawingServiceMock.seeDrawings).toHaveBeenCalled();
  });

  it('#emptyDrawings should call the drawingStorage method', () => {
    service.emptyDrawings();
    expect(drawingServiceMock.emptyDrawings).toHaveBeenCalled();
  });

  it('#resetSelectorBox should call the drawingStorage method', () => {
    service.resetSelectorBox();
    expect(drawingServiceMock.resetSelectorBox).toHaveBeenCalled();
  });

  it('#seeDrawings should call the drawingStorage method', () => {
    service.seeSelection();
    expect(drawingServiceMock.seeSelection).toHaveBeenCalled();
  });

  it('#saveSelectorBox should call the drawingStorage method', () => {
    const dummyIShape: IShape = {
      id: '',
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      primaryColor: '',
      secondaryColor: '',
      strokeOpacity: 0,
      strokeWidth: 0,
      fillOpacity: 0,

    };
    service.saveSelectorBox(dummyIShape);
    expect(drawingServiceMock.saveSelectorBox).toHaveBeenCalled();
  });

  it('#selectorBoxExists should call the drawingStorage method', () => {
    service.selectorBoxExists();
    expect(drawingServiceMock.selectorBoxExists).toHaveBeenCalled();
  });

  it('#chooseRectangle should call #resetSelection and select the rectangle', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseRectangle();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.selectedTool).toBe(ToolConstants.TOOL_ID.RECTANGLE);
  });

  it('#chooseEllipse should call #resetSelection and select the ellipse', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseEllipse();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.selectedTool).toBe(ToolConstants.TOOL_ID.ELLIPSE);
  });

  it('#chooseCrayon should call #resetSelection and select the crayon', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseCrayon();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.selectedTool).toBe(ToolConstants.TOOL_ID.CRAYON);
  });

  it('#chooseLine should call #resetSelection and select the crayon', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseLine();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.selectedTool).toBe(ToolConstants.TOOL_ID.LINE);
  });

  it('#choosePaintbrush should call #resetSelection and select the Paintbrush', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.choosePaintbrush();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.selectedTool).toBe(ToolConstants.TOOL_ID.PAINTBRUSH);
  });

  it('#choosePrimaryColor should call #resetSelection and select the PrimaryColor', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.choosePrimaryColor();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.primaryColorSelected).toBe(true);
    expect(service.selectedTool).toBe(ToolConstants.TOOL_ID.NONE);
  });

  it('#chooseSecondaryColor should call #resetSelection and select the SecondaryColor', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseSecondaryColor();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.secondaryColorSelected).toBe(true);
    expect(service.selectedTool).toBe(ToolConstants.TOOL_ID.NONE);
  });

  it('#choosePolygon should call #resetSelection and select the polygon', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.choosePolygon();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.selectedTool).toBe(ToolConstants.TOOL_ID.POLYGON);
  });

  it('#chooseEyedropper should call #resetSelection and select the ipette', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseEyedropper();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.selectedTool).toBe(ToolConstants.TOOL_ID.PIPETTE);
  });

  it('#chooseSelector should call #resetSelection and select the Selector', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseSelector();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.selectedTool).toBe(ToolConstants.TOOL_ID.SELECTOR);
  });

  it('#chooseOther should call #resetSelection', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseOther();

    expect(resetSpy).toHaveBeenCalled();
  });

  it('#chooseStamp should call #resetSelection and select the stamp', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseStamp();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.selectedTool).toBe(ToolConstants.TOOL_ID.STAMP);
  });

  it('#chooseColourApplicator should call #resetSelection', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseColourApplicator(Strings.WHITE_HEX, Strings.BLACK_HEX);
    expect(service.primaryColor).toEqual(Strings.WHITE_HEX);
    expect(service.secondaryColor).toEqual(Strings.BLACK_HEX);
    expect(resetSpy).toHaveBeenCalled();
    expect(service.selectedTool).toBe(ToolConstants.TOOL_ID.COLOUR_APPLICATOR);
  });

  it('#chooseText should call #resetSelection', () => {
    const resetSpy = spyOn(service, 'resetSelection');
    service.chooseText();

    expect(resetSpy).toHaveBeenCalled();
  });
});
