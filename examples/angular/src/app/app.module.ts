import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { PdfWebViewerComponent } from './components/pdf-web-viewer/pdf-web-viewer.component';

@NgModule({
  declarations: [AppComponent, PdfWebViewerComponent],
  imports: [BrowserModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
