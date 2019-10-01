import SpyObj = jasmine.SpyObj;

import { async } from '@angular/core/testing';

import { LocalStorageService } from 'src/app/services/local_storage/LocalStorageService';
import { AppConstants } from 'src/AppConstants';
import { NewDrawingModalData } from '../NewDrawingModalData';
import { MockCanvasComponent } from './mock-canvas.component';

describe('MockCanvasComponent', () => {
  let dataMock: SpyObj<NewDrawingModalData>;
  let mockLocalStorage: SpyObj<LocalStorageService>;
  let component: MockCanvasComponent;

  beforeEach(async(() => {
    dataMock = jasmine.createSpyObj('NewDrawingModalData', ['']);
    mockLocalStorage = jasmine.createSpyObj('LocalStorageService',  ['isColourApplicatorSelected']);
    component = new MockCanvasComponent(dataMock, mockLocalStorage);
  }));

  it('should have a defined injected data', () => {
    expect(dataMock).toBeDefined();
  });

  it('should apply primary color', () => {
    const testObject = { x: 1,
      y: 1,
      width: 1,
      height: 1,
      primeColor: AppConstants.DEFAULT_PRIMARY_COLOUR,
      secondColor: AppConstants.DEFAULT_SECONDARY_COLOUR,
      strokeOpacity: 1,
      strokeWidth: 1,
      fillOpacity: 1, };
    mockLocalStorage.primaryColor = AppConstants.DEFAULT_SECONDARY_COLOUR;
    mockLocalStorage.isColourApplicatorSelected.and.returnValue(true);
    component.applyColour(testObject);
    expect(testObject.primeColor).toEqual(AppConstants.DEFAULT_SECONDARY_COLOUR);
  });

  it('should apply secondary color', () => {
    const testObject = { x: 1,
      y: 1,
      width: 1,
      height: 1,
      primeColor: AppConstants.DEFAULT_PRIMARY_COLOUR,
      secondColor: AppConstants.DEFAULT_SECONDARY_COLOUR,
      strokeOpacity: 1,
      strokeWidth: 1,
      fillOpacity: 1, };
    mockLocalStorage.secondaryColor = AppConstants.DEFAULT_PRIMARY_COLOUR;
    mockLocalStorage.isColourApplicatorSelected.and.returnValue(true);
    component.applySecondaryColour(new MouseEvent('contextmenu'), testObject);
    expect(testObject.secondColor).toEqual(AppConstants.DEFAULT_PRIMARY_COLOUR);
  });

});
