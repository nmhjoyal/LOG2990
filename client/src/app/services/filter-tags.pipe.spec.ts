import SpyObj = jasmine.SpyObj;

import { IDrawing } from '../../../../common/drawing-information/IDrawing';
import { CanvasInformationService } from './canvas-information/canvas-information.service';
import { FilterTagsPipe } from './filter-tags.pipe';
import { ToolHandlerService } from './tool-handler/tool-handler.service';

describe('FilterTagsPipe', () => {
  const toolHandlerMock: SpyObj<ToolHandlerService> = jasmine.createSpyObj('ToolHandlerService', ['clearPage']);
  const canvasDataMock: SpyObj<CanvasInformationService> = jasmine.createSpyObj('CanvasInformationService', ['']);

  const mockDrawing = {
    name: 'name',
    tags: [{ name: 'tag', isSelected: true }, { name: 'tag2', isSelected: false }],
    timestamp: new Date().toLocaleString('en-GB', { timeZone: 'UTC' }),
    shapes: toolHandlerMock.drawings,
    canvas: canvasDataMock.data,
  } as IDrawing;

  const mockDrawing2 = {
    name: 'name',
    tags: [{ name: 'tag', isSelected: true }, { name: 'tag3', isSelected: false }],
    timestamp: new Date().toLocaleString('en-GB', { timeZone: 'UTC' }),
    shapes: toolHandlerMock.drawings,
    canvas: canvasDataMock.data,
  } as IDrawing;

  const mockDrawing3 = {
    name: 'name',
    tags: [],
    timestamp: new Date().toLocaleString('en-GB', { timeZone: 'UTC' }),
    shapes: toolHandlerMock.drawings,
    canvas: canvasDataMock.data,
  } as IDrawing;

  const drawingList = [mockDrawing, mockDrawing2, mockDrawing3];
  it('create an instance', () => {
    const pipe = new FilterTagsPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return all items if all is selected', () => {
    const pipe = new FilterTagsPipe();
    const returnedDrawing = pipe.transform(drawingList, ['all']).valueOf();
    expect(returnedDrawing).toEqual(drawingList);
  });

  it('should return the correct items for a selected tag', () => {
    const pipe = new FilterTagsPipe();
    const returnedDrawing = pipe.transform(drawingList, ['tag']).valueOf();
    expect(returnedDrawing).toEqual([mockDrawing, mockDrawing2]);
  });

  it('should return no items if selected tag is not present', () => {
    const pipe = new FilterTagsPipe();
    const returnedDrawing = pipe.transform([mockDrawing3], ['fakeTag']);
    expect(returnedDrawing).toEqual([]);
  });

});
