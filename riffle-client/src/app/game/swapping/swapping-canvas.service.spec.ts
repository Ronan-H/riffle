import { TestBed } from '@angular/core/testing';

import { SwappingCanvasService } from './swapping-canvas.service';

describe('SwappingCanvasService', () => {
  let service: SwappingCanvasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SwappingCanvasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
