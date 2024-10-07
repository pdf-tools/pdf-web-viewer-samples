import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PdfWebViewerComponent } from './pdf-web-viewer/pdf-web-viewer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PdfWebViewerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'view-pdf';
}
