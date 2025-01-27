import { Component } from '@angular/core';

interface PdfDocument {
  name: string;
  url: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  documents: PdfDocument[];
  selectedDocument: PdfDocument;

  constructor() {
    this.documents = [
      {
        name: 'PdfWebViewer',
        url: 'documents/PdfWebViewer.pdf'
      },
      {
        name: 'PdfPrimerWhitepaper',
        url: 'documents/PdfPrimerWhitepaper.pdf'
      },
      {
        name: 'GraphicsNone',
        url: 'documents/GraphicsNone.pdf'
      }
    ];
    this.selectedDocument = this.documents[0];
  }
}
