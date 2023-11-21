import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListGlukerComponent } from './list-gluker.component';

describe('ListGlukerComponent', () => {
  let component: ListGlukerComponent;
  let fixture: ComponentFixture<ListGlukerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListGlukerComponent]
    });
    fixture = TestBed.createComponent(ListGlukerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
