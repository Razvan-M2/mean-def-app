import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendedViewComponent } from './recommended-view.component';

describe('RecommendedViewComponent', () => {
  let component: RecommendedViewComponent;
  let fixture: ComponentFixture<RecommendedViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendedViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendedViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
