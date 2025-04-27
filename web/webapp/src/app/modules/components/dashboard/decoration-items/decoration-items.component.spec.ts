import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecorationItemsComponent } from './decoration-items.component';

describe('DecorationItemsComponent', () => {
  let component: DecorationItemsComponent;
  let fixture: ComponentFixture<DecorationItemsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecorationItemsComponent]
    });
    fixture = TestBed.createComponent(DecorationItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
