import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { PdfWebViewer, FileType } from '@pdf-tools/four-heights-pdf-web-viewer';
import license from '../../../license';

@Component({
  selector: 'app-pdf-web-viewer',
  templateUrl: './pdf-web-viewer.component.html',
  styleUrls: ['./pdf-web-viewer.component.scss'],
})
export class PdfWebViewerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('viewerContainer') viewerContainer!: ElementRef;
  @Input() author!: string;
  @Input() readOnly!: boolean;
  @Input()
  get url(): string {
    return this._url;
  }
  set url(url: string) {
    this._url = url;
    this.openDocument();
  }
  @Output() saved = new EventEmitter<Uint8Array>();

  private _url = '';
  private viewerLoaded = false;
  private pdfWebViewer?: PdfWebViewer;

  constructor() {
    this.handlePdfViewerLoaded = this.handlePdfViewerLoaded.bind(this);
    this.handleSaveButtonClicked = this.handleSaveButtonClicked.bind(this);
    this.handleOpenButtonClicked = this.handleOpenButtonClicked.bind(this);
  }

  private handlePdfViewerLoaded() {
    this.viewerLoaded = true;
    if (this.url) {
      this.openDocument();
    }
  }

  private async handleSaveButtonClicked() {
    console.log('save button clicked');
    // saveFile returns a Uint8Array
    const fileData = await this.pdfWebViewer?.save();
    if (fileData) {
      const buffer = await fileData.arrayBuffer();
      this.saved.emit(new Uint8Array(buffer));
    }
  }

  private async handleOpenButtonClicked() {
    console.log('open button clicked');
  }

  private openDocument() {
    if (this.viewerLoaded) {
      // convert the pdf document urls into absolute paths
      // the pdf document urls are defined as relative path but the viewer loads the documents relative to the location of the web assembly.
      const { pathname } = document.location;
      const absoluteDocumentUrl =
        pathname.substring(0, pathname.lastIndexOf('/') + 1) + this.url;

      // open file acceppts a blob or a string with a uri
      this.pdfWebViewer?.open({ uri: absoluteDocumentUrl });
    }
  }

  ngAfterViewInit(): void {
    // options can only be set in the constructor. If you need to change some settings, you must create a new PdfWebViewer
    const options = {
      viewer: {
        general: {
          user: this.author,
        },
        readOnly: this.readOnly,
        permissions: {
          allowFileDrop: false,
          allowOpenFile: true,
          allowSaveFile: true,
        },
        callbacks: {
          onSaveFileButtonClicked: this.handleSaveButtonClicked,
          onOpenFileButtonClicked: this.handleOpenButtonClicked,
        },
      },
    };

    this.pdfWebViewer = new PdfWebViewer(
      this.viewerContainer.nativeElement,
      license,
      options
    );

    this.pdfWebViewer.addEventListener('appLoaded', this.handlePdfViewerLoaded);
  }

  ngOnDestroy() {
    if (this.pdfWebViewer) {
      // call destroy to release all the allocated resources
      this.pdfWebViewer.destroy();
    }
  }
}
