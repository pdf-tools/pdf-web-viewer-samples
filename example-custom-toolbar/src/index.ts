import { PdfFitMode, PdfPageLayoutMode, PdfWebViewer, PdfWebViewerOptionsInterface } from '@pdf-tools/four-heights-pdf-web-viewer'
import 'material-icons/iconfont/material-icons.css';
import './styles.scss'
import CustomToolbar from './custom-toolbar';

const viewerElement = document.getElementById('pdfviewer')
const license = ''
const options: Partial<PdfWebViewerOptionsInterface> = {
  viewer: {
    general: {
      user: 'John Doe',
      disableMainToolbar: false,
      disableAnnotationToolbar: true,
    },
  },
}

const pdfViewer = new PdfWebViewer(viewerElement, license, options)

console.log(pdfViewer);

const customToolbar = new CustomToolbar(
  {
    onUploadFile(file: File) {
      pdfViewer.open({ data: file });
    },
    onDownloadFileButtonClicked() {
      pdfViewer.downloadFile();
    },
    onPageNumberChanged(pageNumber: number) {
      pdfViewer.setPageNumber(pageNumber);
    },
    onToggleInformationPaneButtonClicked(visible: boolean) {
      visible ? pdfViewer.showInformationPane() : pdfViewer.hideInformationPane();
    },
    onRotateViewerButtonClicked() {
      pdfViewer.setRotation((pdfViewer.getRotation() + 90) % 360);
    },
    onFitModeChanged(fitMode: PdfFitMode) {
      console.log(pdfViewer.getFitMode());
      pdfViewer.setFitMode(fitMode);
    },
    onLayoutModeChanged(layoutMode: PdfPageLayoutMode) {
      pdfViewer.setPageLayoutMode(layoutMode);
    },
  }
);

pdfViewer.addEventListener('appLoaded', function () {
  pdfViewer.open({ uri: '/PdfWebViewer.pdf' });
})

pdfViewer.addEventListener('documentLoaded', function () {
  customToolbar.setPageNumber(pdfViewer.getPageNumber());
  customToolbar.setPageCount(pdfViewer.getPageCount());
})

pdfViewer.addEventListener('pageNumberChanged', function (pageNumber: number) {
  customToolbar.setPageNumber(pageNumber);
});