import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseViewComponent } from './browse-view.component';

describe('BrowseViewComponent', () => {
  let component: BrowseViewComponent;
  let fixture: ComponentFixture<BrowseViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrowseViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
