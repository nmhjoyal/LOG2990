import { TestBed } from '@angular/core/testing';

import { ToolHandlerService } from './tool-handler.service';

describe('ToolHandlerServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToolHandlerService = TestBed.get(ToolHandlerService);
    expect(service).toBeTruthy();
  });
});
