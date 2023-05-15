import {
  EraserModule,
  FreetextAnnotationModule,
  HighlightAnnotationModule,
  ImageAnnotationModule,
  InkAnnotationModule,
  PdfWebViewer,
  PdfWebViewerOptionsInterface,
  ShapeAnnotationModule,
  StampAnnotationModule,
  TextAnnotationModule
} from '@pdf-tools/four-heights-pdf-web-viewer';

import './styles.scss';

const viewerElement = document.querySelector<HTMLDivElement>('#pdfviewer');
const license: string = '';
const options: Partial<PdfWebViewerOptionsInterface> = {
  viewer: {
    general: {
      user: 'John Doe'
    }
  },
  // Remove unused modules from the list
  modules: [
    InkAnnotationModule,
    EraserModule,
    HighlightAnnotationModule,
    ImageAnnotationModule,
    ShapeAnnotationModule,
    StampAnnotationModule,
    FreetextAnnotationModule,
    TextAnnotationModule
  ]
};

const pdfViewer = new PdfWebViewer(viewerElement, license, options);

pdfViewer.addEventListener('appLoaded', () => {
  pdfViewer.open({ uri: '/PdfWebViewer.pdf' });
});
