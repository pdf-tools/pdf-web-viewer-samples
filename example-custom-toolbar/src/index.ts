import { PdfWebViewer, PdfWebViewerOptionsInterface } from '@pdf-tools/four-heights-pdf-web-viewer'
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

const customToolbar = new CustomToolbar(
  {
    onUploadFileButtonClicked() {
      // TODO
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