import { afterNextRender, Component, ElementRef, viewChild } from '@angular/core';
import { PdfToolsViewer } from '@pdftools/pdf-web-viewer';

@Component({
  selector: 'app-pdf-web-viewer',
  templateUrl: './pdf-web-viewer.html',
  styleUrl: './pdf-web-viewer.scss',
})
export class PdfWebViewer {
  private readonly viewerContainer = viewChild.required<ElementRef<HTMLDivElement>>('viewerContainer');
  private pdfWebViewer?: PdfToolsViewer;

  constructor() {
    afterNextRender(() => this.initPdfToolsViewer());
  }

  async initPdfToolsViewer() {
    this.pdfWebViewer = new PdfToolsViewer();
    await this.pdfWebViewer.initialize({}, this.viewerContainer().nativeElement);
  }
}
