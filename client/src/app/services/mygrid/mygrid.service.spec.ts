import { TestBed } from '@angular/core/testing';

import { MygridService } from './mygrid.service';

describe('MygridService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MygridService = TestBed.get(MygridService);
    expect(service).toBeTruthy();
  });
});
