import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestlistDetailsComponent } from './requestlist-details.component';

describe('RequestlistDetailsComponent', () => {
  let component: RequestlistDetailsComponent;
  let fixture: ComponentFixture<RequestlistDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestlistDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestlistDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
