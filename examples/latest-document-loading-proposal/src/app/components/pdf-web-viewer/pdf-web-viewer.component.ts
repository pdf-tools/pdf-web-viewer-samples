import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { PdfWebViewer } from '@pdf-tools/four-heights-pdf-web-viewer';
import license from '../../../license';

@Component({
  selector: 'app-pdf-web-viewer',
  templateUrl: './pdf-web-viewer.component.html',
  styleUrls: ['./pdf-web-viewer.component.scss']
})
export class PdfWebViewerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('viewerContainer') viewerContainer!: ElementRef;
  @Input()
  get url(): string {
    return this._url;
  }
  set url(url: string) {
    this._url = url;
    this.openDocument();
  }
  private _url = '';
  private _latestOpenedDocumentUrl = '';
  private isViewerLoadingDocument = false;
  private isViewerInitialized = false;
  private pdfWebViewer?: PdfWebViewer;

  constructor() {}

  ngAfterViewInit(): void {
    // options can only be set in the constructor. If you need to change some settings, you must create a new PdfWebViewer
    const options = {
      viewer: {
        general: {
          user: 'John Doe'
        }
      }
    };

    this.pdfWebViewer = new PdfWebViewer(
      this.viewerContainer.nativeElement,
      license,
      options
    );

    this.pdfWebViewer.addEventListener('appLoaded', () => {
      this.handlePdfViewerLoaded();
    });

    this.pdfWebViewer.addEventListener('documentLoaded', () => {
      this.handleDocumentLoaded();
    });
  }

  ngOnDestroy() {
    if (this.pdfWebViewer) {
      // call destroy to release all the allocated resources
      this.pdfWebViewer.destroy();
    }
  }

  private openDocument() {
    if (!this.isViewerInitialized || this.isViewerLoadingDocument) {
      return;
    }

    this.isViewerLoadingDocument = true;
    this._latestOpenedDocumentUrl = this.url;
    console.log('openDocument ' + this.url);

    // convert the pdf document urls into absolute paths
    // the pdf document urls are defined as relative path but the viewer loads the documents relative to the location of the web assembly.
    const { pathname } = document.location;
    const absoluteDocumentUrl =
      pathname.substring(0, pathname.lastIndexOf('/') + 1) + this.url;

    // open file acceppts a blob or a string with a uri
    this.pdfWebViewer?.open({ uri: absoluteDocumentUrl });
  }

  private handlePdfViewerLoaded() {
    console.log('appLoaded');
    this.isViewerInitialized = true;
    if (this.url) {
      this.openDocument();
    }
  }

  private async handleDocumentLoaded() {
    console.log('documentLoaded');
    this.isViewerLoadingDocument = false;
    if (this._latestOpenedDocumentUrl !== this.url) {
      this.openDocument();
    }
  }
}
