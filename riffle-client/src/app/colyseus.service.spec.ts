import { TestBed } from '@angular/core/testing';

import { ColyseusService } from './colyseus.service';

describe('ColyseusService', () => {
  let service: ColyseusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColyseusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
