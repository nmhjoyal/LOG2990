import { TestBed } from '@angular/core/testing';

import { RotateSelectionService } from './rotate-selection.service';

describe('RotateSelectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RotateSelectionService = TestBed.get(RotateSelectionService);
    expect(service).toBeTruthy();
  });
});
