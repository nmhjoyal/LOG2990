import { TestBed } from '@angular/core/testing';

import { ImageStorageService } from './image-storage.service';

describe('ImageStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImageStorageService = TestBed.get(ImageStorageService);
    expect(service).toBeTruthy();
  });
});
