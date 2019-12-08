import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransversalComponent } from './transversal.component';

describe('TransversalComponent', () => {
  let component: TransversalComponent;
  let fixture: ComponentFixture<TransversalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransversalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransversalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
