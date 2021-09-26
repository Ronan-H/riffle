import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowdownComponent } from './showdown.component';

describe('ShowdownComponent', () => {
  let component: ShowdownComponent;
  let fixture: ComponentFixture<ShowdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
