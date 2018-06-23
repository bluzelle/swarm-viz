import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SummarypageComponent } from './summarypage.component';

describe('SummarypageComponent', () => {
  let component: SummarypageComponent;
  let fixture: ComponentFixture<SummarypageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SummarypageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SummarypageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
