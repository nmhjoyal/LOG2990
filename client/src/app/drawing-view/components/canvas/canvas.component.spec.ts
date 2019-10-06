import SpyObj = jasmine.SpyObj;

import { async } from '@angular/core/testing';

import { INewDrawingModalData } from '../INewDrawingModalData';

describe('CanvasComponent', () => {
  let dataMock: SpyObj<INewDrawingModalData>;

  beforeEach(async(() => {
    dataMock = jasmine.createSpyObj('NewDrawingModalData', ['']);
  }));

  it('should have a defined injected data', () => {
    expect(dataMock).toBeDefined();
  });
});
