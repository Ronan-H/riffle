import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SwappingComponent } from './swapping.component';

describe('SwappingComponent', () => {
  let component: SwappingComponent;
  let fixture: ComponentFixture<SwappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SwappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SwappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
