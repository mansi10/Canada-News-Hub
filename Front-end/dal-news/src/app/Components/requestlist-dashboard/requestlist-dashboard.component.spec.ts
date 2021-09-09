import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestlistDashboardComponent } from './requestlist-dashboard.component';

describe('RequestlistDashboardComponent', () => {
  let component: RequestlistDashboardComponent;
  let fixture: ComponentFixture<RequestlistDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestlistDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestlistDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
