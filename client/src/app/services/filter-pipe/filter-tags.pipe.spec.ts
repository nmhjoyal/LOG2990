import SpyObj = jasmine.SpyObj;

import { IDrawing } from '../../../../../common/drawing-information/IDrawing';
import { CanvasInformationService } from '../canvas-information/canvas-information.service';
import { DrawingStorageService } from '../drawing-storage/drawing-storage.service';
import { FilterTagsPipe } from './filter-tags.pipe';

describe('FilterTagsPipe', () => {
  const drawingStorageMock: SpyObj<DrawingStorageService> = jasmine.createSpyObj('DrawingStorageService', ['emptyDrawing']);
  const canvasDataMock: SpyObj<CanvasInformationService> = jasmine.createSpyObj('CanvasInformationService', ['']);

  const mockDrawing = {
    name: 'name',
    tags: [{ name: 'tag', isSelected: true }, { name: 'tag2', isSelected: false }],
    timestamp: new Date().toLocaleString('en-GB', { timeZone: 'UTC' }),
    shapes: drawingStorageMock.drawings,
    canvas: canvasDataMock.data,
  } as IDrawing;

  const mockDrawing2 = {
    name: 'name',
    tags: [{ name: 'tag', isSelected: true }, { name: 'tag3', isSelected: false }],
    timestamp: new Date().toLocaleString('en-GB', { timeZone: 'UTC' }),
    shapes: drawingStorageMock.drawings,
    canvas: canvasDataMock.data,
  } as IDrawing;

  const mockDrawing3 = {
    name: 'name',
    timestamp: new Date().toLocaleString('en-GB', { timeZone: 'UTC' }),
    shapes: drawingStorageMock.drawings,
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

  it('should return undefined if there is no selected tag with the specified name', () => {
    const pipe = new FilterTagsPipe();
    const returnedValue = pipe.transform([mockDrawing3], ['fake']);
    returnedValue.forEach((item) => {
      expect(item.tags).toBeUndefined();
    });
    expect(returnedValue).toEqual([]);
  });

});
