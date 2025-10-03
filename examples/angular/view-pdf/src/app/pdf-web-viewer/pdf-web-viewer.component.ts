import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { PdfToolsViewer } from '@pdftools/pdf-web-viewer';

@Component({
  selector: 'app-pdf-web-viewer',
  standalone: true,
  imports: [],
  templateUrl: './pdf-web-viewer.component.html',
  styleUrl: './pdf-web-viewer.component.scss'
})
export class PdfWebViewerComponent implements AfterViewInit {
  @ViewChild('viewerContainer') viewerContainer?: ElementRef<HTMLDivElement>;
  private pdfWebViewer?: PdfToolsViewer;

  constructor() {}

  ngAfterViewInit(): void {
    this.initPdfToolsViewer();
  }

  async initPdfToolsViewer() {
    this.pdfWebViewer = new PdfToolsViewer();
    await this.pdfWebViewer.initialize({}, this.viewerContainer?.nativeElement as HTMLElement);
  }
}
