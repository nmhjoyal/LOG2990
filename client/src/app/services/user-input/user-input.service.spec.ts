import { TestBed } from '@angular/core/testing';

import { UserInputService } from './user-input.service';

describe('UserInputService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserInputService = TestBed.get(UserInputService);
    expect(service).toBeTruthy();
  });
});
