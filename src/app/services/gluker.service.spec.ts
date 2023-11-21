import { TestBed } from '@angular/core/testing';

import { GlukerService } from './gluker.service';

describe('GlukerService', () => {
  let service: GlukerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlukerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
