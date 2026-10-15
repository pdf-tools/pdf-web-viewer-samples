import { Component } from '@angular/core';
import { PdfWebViewer } from './pdf-web-viewer/pdf-web-viewer';

@Component({
  selector: 'app-root',
  imports: [PdfWebViewer],
  templateUrl: './app.html',
})
export class App {}
