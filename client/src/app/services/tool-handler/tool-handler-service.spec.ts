// tslint:disable: no-string-literal

import { TestBed } from '@angular/core/testing';
import { ToolConstants } from 'src/app/drawing-view/components/tools/assets/constants/tool-constants';
import { Strings } from 'src/AppConstants/Strings';
import { ColourService } from '../colour_service/colour.service';
import { DrawingStorageService } from '../drawing-storage/drawing-storage.service';
import { ToolHandlerService } from './tool-handler.service';

const FIFTY = 50;

describe('ToolHandlerService', () => {
  let service: ToolHandlerService;
  let colourService: ColourService;
  const drawingServiceMock: jasmine.SpyObj<DrawingStorageService> = jasmine.createSpyObj('drawingServiceMock',
    ['saveDrawing', 'seeDrawings', 'emptyDrawings', 'resetSelectorBox', 'saveSelectorBox', 'selectorBoxExists']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: DrawingStorageService, useValue: drawingServiceMock, },
      ],
    });
    service = TestBed.get(ToolHandlerService);
    colourService = TestBed.get(ColourService);

  });

  it('should be created with correct initialized values', () => {
    expect(service).toBeTruthy();

    expect(service.selectedTool).toBe(ToolConstants.TOOL_ID.NONE);
    expect(service['selection']).toEqual({
      x: 0, y: 0, width: 0, height: 0, primaryColour: 'black', secondaryColour: 'black',
      fillOpacity: 0, strokeOpacity: 1, strokeWidth: 1, id: ToolConstants.TOOL_ID.SELECTOR,
    });
    expect(service['primaryColourSelected']).toBe(false);
    expect(service['secondaryColourSelected']).toBe(false);
    expect(service['primaryColour']).toEqual(colourService.colour[0]);
    expect(service['secondaryColour']).toEqual(colourService.colour[1]);
  });

  it('#secondaryColour should properly access the secondary colour', () => {
    const colour = colourService.colour[1];
    expect(colour).toBe(colourService.colour[1]);
  });

  it('#primaryColour should propely access the primary colour', () => {
    const colour = colourService.colour[0];
    expect(colour).toBe(colourService.colour[0]);
  });

  it('#resetToolSelection should reset all tool selections to false and set noneSelected to true', () => {
    spyOn(service, 'resetSelectorBox').and.callThrough();
    service.resetToolSelection();

    expect(service.selectedTool).toBe(ToolConstants.TOOL_ID.NONE);
    expect(service['primaryColourSelected']).toBe(false);
    expect(service['secondaryColourSelected']).toBe(false);
    expect(service.resetSelectorBox).toHaveBeenCalled();
  });

  it('#isUsingText should return true if text is selected', () => {
    expect(service.isUsingText()).toBe(false);
    service.selectedTool = service.tools.TEXT;
    expect(service.isUsingText()).toBe(true);
  });

  it('#resetSelectorBox should reset selector property to default data', () => {
    service['selection'] = {
      x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, primaryColour: 'black', secondaryColour: 'black',
      fillOpacity: 0, strokeOpacity: 1, strokeWidth: 1, id: ToolConstants.TOOL_ID.SELECTOR,
    };
    service.resetSelectorBox();
    expect(service['selection']).toEqual({
      x: 0, y: 0, width: 0, height: 0, primaryColour: 'black', secondaryColour: 'black',
      fillOpacity: 0, strokeOpacity: 1, strokeWidth: 1, id: ToolConstants.TOOL_ID.SELECTOR,
    });
  });

  it('#saveSelectorBox should set selector property to input data', () => {
    const selection = {
      x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, primaryColour: 'black', secondaryColour: 'black',
      fillOpacity: 0, strokeOpacity: 1, strokeWidth: 1, id: ToolConstants.TOOL_ID.SELECTOR,
    };
    service.saveSelectorBox(selection);
    expect(service['selection']).toEqual(selection);
  });

  it('#selectorBoxExists should return false if height or width are 0 and true otherwise', () => {
    expect(service.selectorBoxExists()).toBeFalsy();
    const selection = {
      x: FIFTY, y: FIFTY, width: FIFTY, height: FIFTY, primaryColour: 'black', secondaryColour: 'black',
      fillOpacity: 0, strokeOpacity: 1, strokeWidth: 1, id: ToolConstants.TOOL_ID.SELECTOR,
    };
    service.saveSelectorBox(selection);
    expect(service.selectorBoxExists()).toBeTruthy();
  });

  it('#chooseRectangle should call #resetToolSelection and select the rectangle', () => {
    const resetSpy = spyOn(service, 'resetToolSelection');
    service.chooseRectangle();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.selectedTool).toBe(ToolConstants.TOOL_ID.RECTANGLE);
  });

  it('#chooseEllipse should call #resetToolSelection and select the ellipse', () => {
    const resetSpy = spyOn(service, 'resetToolSelection');
    service.chooseEllipse();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.selectedTool).toBe(ToolConstants.TOOL_ID.ELLIPSE);
  });

  it('#chooseCrayon should call #resetToolSelection and select the crayon', () => {
    const resetSpy = spyOn(service, 'resetToolSelection');
    service.chooseCrayon();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.selectedTool).toBe(ToolConstants.TOOL_ID.CRAYON);
  });

  it('#chooseLine should call #resetToolSelection and select the crayon', () => {
    const resetSpy = spyOn(service, 'resetToolSelection');
    service.chooseLine();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.selectedTool).toBe(ToolConstants.TOOL_ID.LINE);
  });

  it('#choosePaintbrush should call #resetToolSelection and select the Paintbrush', () => {
    const resetSpy = spyOn(service, 'resetToolSelection');
    service.choosePaintbrush();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.selectedTool).toBe(ToolConstants.TOOL_ID.PAINTBRUSH);
  });

  it('#choosePrimaryColour should call #resetToolSelection and select the PrimaryColour', () => {
    const resetSpy = spyOn(service, 'resetToolSelection');
    service.choosePrimaryColour();

    expect(resetSpy).toHaveBeenCalled();
    expect(service['primaryColourSelected']).toBe(true);
    expect(service.selectedTool).toBe(ToolConstants.TOOL_ID.NONE);
  });

  it('#chooseSecondaryColour should call #resetToolSelection and select the SecondaryColour', () => {
    const resetSpy = spyOn(service, 'resetToolSelection');
    service.chooseSecondaryColour();

    expect(resetSpy).toHaveBeenCalled();
    expect(service['secondaryColourSelected']).toBe(true);
    expect(service.selectedTool).toBe(ToolConstants.TOOL_ID.NONE);
  });

  it('#choosePolygon should call #resetToolSelection and select the polygon', () => {
    const resetSpy = spyOn(service, 'resetToolSelection');
    service.choosePolygon();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.selectedTool).toBe(ToolConstants.TOOL_ID.POLYGON);
  });

  it('#chooseEyedropper should call #resetToolSelection and select the pipette', () => {
    const resetSpy = spyOn(service, 'resetToolSelection');
    service.chooseEyedropper();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.selectedTool).toBe(ToolConstants.TOOL_ID.PIPETTE);
  });

  it('#chooseSelector should call #resetToolSelection and select the Selector', () => {
    const resetSpy = spyOn(service, 'resetToolSelection');
    service.chooseSelector();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.selectedTool).toBe(ToolConstants.TOOL_ID.SELECTOR);
  });

  it('#chooseOther should call #resetToolSelection', () => {
    const resetSpy = spyOn(service, 'resetToolSelection');
    service.chooseOther();

    expect(resetSpy).toHaveBeenCalled();
  });

  it('#chooseStamp should call #resetToolSelection and select the stamp', () => {
    const resetSpy = spyOn(service, 'resetToolSelection');
    service.chooseStamp();

    expect(resetSpy).toHaveBeenCalled();
    expect(service.selectedTool).toBe(ToolConstants.TOOL_ID.STAMP);
  });

  it('#chooseColourApplicator should call #resetToolSelection', () => {
    const resetSpy = spyOn(service, 'resetToolSelection');
    service.chooseColourApplicator(Strings.WHITE_HEX, Strings.BLACK_HEX);
    expect(service['primaryColour']).toEqual(Strings.WHITE_HEX);
    expect(service['secondaryColour']).toEqual(Strings.BLACK_HEX);
    expect(resetSpy).toHaveBeenCalled();
    expect(service.selectedTool).toBe(ToolConstants.TOOL_ID.COLOUR_APPLICATOR);
  });

  it('#chooseText should call #resetToolSelection', () => {
    const resetSpy = spyOn(service, 'resetToolSelection');
    service.chooseText();

    expect(resetSpy).toHaveBeenCalled();
  });

  it('#choosePen should call #resetToolSelection', () => {
    const resetSpy = spyOn(service, 'resetToolSelection');
    service.choosePen();
    expect(resetSpy).toHaveBeenCalled();
    expect(service.selectedTool).toBe(ToolConstants.TOOL_ID.PEN);
  });
});
