import SpyObj = jasmine.SpyObj;

import { async } from '@angular/core/testing';

import { NewDrawingModalData } from '../NewDrawingModalData';

describe('MockCanvasComponent', () => {
  let dataMock: SpyObj<NewDrawingModalData>;

  beforeEach(async(() => {
    dataMock = jasmine.createSpyObj('NewDrawingModalData', ['']);
  }));

  it('should have a defined injected data', () => {
    expect(dataMock).toBeDefined();
  });
});
