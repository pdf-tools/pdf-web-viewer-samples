import { PdfFitMode, PdfPageLayoutMode, PdfWebViewer, PdfWebViewerOptionsInterface, SearchOptions } from '@pdf-tools/four-heights-pdf-web-viewer'
import 'material-icons/iconfont/material-icons.css';
import './styles.scss'
import CustomToolbar from './custom-toolbar';

const viewerElement = document.getElementById('pdfviewer')
const license = ''
const options: Partial<PdfWebViewerOptionsInterface> = {
  viewer: {
    general: {
      user: 'John Doe',
      disableMainToolbar: true,
      disableAnnotationToolbar: true,
    },
  },
}

const pdfViewer = new PdfWebViewer(viewerElement, license, options)

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
    onZoomChanged(zoom: number) {
      pdfViewer.setZoom(zoom / 100);
    },
    onRotateViewerButtonClicked() {
      pdfViewer.setRotation((pdfViewer.getRotation() + 90) % 360);
    },
    onFitModeChanged(fitMode: PdfFitMode) {
      pdfViewer.setFitMode(fitMode);
    },
    onLayoutModeChanged(layoutMode: PdfPageLayoutMode) {
      pdfViewer.setPageLayoutMode(layoutMode);
    },
    onToggleSearchClicked(active: boolean) {
      if (!active) pdfViewer.endSearch();
    },
    onSearchParamsChanged(searchString: string, searchOptions?: SearchOptions) {
      searchString.length > 0 ? pdfViewer.startSearch(searchString, searchOptions) : pdfViewer.endSearch();
    },
    onPrevSearchButtonClicked() {
      pdfViewer.previousSearchMatch();
    },
    onNextSearchButtonClicked() {
      pdfViewer.nextSearchMatch();
    },
  },
);

pdfViewer.addEventListener('appLoaded', function () {
  pdfViewer.open({ uri: '/PdfWebViewer.pdf' });
  pdfViewer.startSearch('');
})

pdfViewer.addEventListener('documentLoaded', function () {
  customToolbar.setPageNumber(pdfViewer.getPageNumber());
  customToolbar.setPageCount(pdfViewer.getPageCount());
})

pdfViewer.addEventListener('pageNumberChanged', function (pageNumber: number) {
  customToolbar.setPageNumber(pageNumber);
});

pdfViewer.addEventListener('fitModeChanged', function (fitMode: PdfFitMode) {
  customToolbar.setFitMode(fitMode);
});

pdfViewer.addEventListener('zoomChanged', function (zoom: number) {
  customToolbar.setZoom(Math.floor(zoom * 100));
});