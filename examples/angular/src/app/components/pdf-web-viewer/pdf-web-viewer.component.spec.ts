import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfWebViewerComponent } from './pdf-web-viewer.component';

describe('PdfWebViewerComponent', () => {
  let component: PdfWebViewerComponent;
  let fixture: ComponentFixture<PdfWebViewerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PdfWebViewerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfWebViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
