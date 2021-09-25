import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwappingCanvasComponent } from './swapping-canvas.component';

describe('SwappingCanvasComponent', () => {
  let component: SwappingCanvasComponent;
  let fixture: ComponentFixture<SwappingCanvasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwappingCanvasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwappingCanvasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
