import { TestBed } from '@angular/core/testing';

import { CanvasInformationService } from './canvas-information.service';

describe('CanvasInformationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CanvasInformationService = TestBed.get(CanvasInformationService);
    expect(service).toBeTruthy();
  });
});
