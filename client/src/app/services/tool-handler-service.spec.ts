import { TestBed } from '@angular/core/testing';

import { ToolHandlerService } from './tool-handler-service.service';

describe('ToolHandlerServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ToolHandlerService = TestBed.get(ToolHandlerServiceService);
    expect(service).toBeTruthy();
  });
});
