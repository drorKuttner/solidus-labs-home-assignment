import { TestBed } from '@angular/core/testing';

import { ActiveEventService } from './active-event.service';

describe('ActiveEventService', () => {
  let service: ActiveEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActiveEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
