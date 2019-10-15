import { TestBed } from '@angular/core/testing';

import { DrawingStorageService } from './drawing-storage.service';

describe('DrawingStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DrawingStorageService = TestBed.get(DrawingStorageService);
    expect(service).toBeTruthy();
  });
});
