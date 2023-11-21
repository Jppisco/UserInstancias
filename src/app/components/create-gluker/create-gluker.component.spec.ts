import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGlukerComponent } from './create-gluker.component';

describe('CreateGlukerComponent', () => {
  let component: CreateGlukerComponent;
  let fixture: ComponentFixture<CreateGlukerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateGlukerComponent]
    });
    fixture = TestBed.createComponent(CreateGlukerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
