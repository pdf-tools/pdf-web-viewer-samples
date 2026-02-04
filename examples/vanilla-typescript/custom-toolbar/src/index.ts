import {
  PdfFitMode,
  PdfPageLayoutMode,
  PdfWebViewer,
  PdfWebViewerOptionsInterface,
  SearchOptions
} from '@pdftools/four-heights-pdf-web-viewer';
import CustomToolbar, {
  CustomToolbarCallbacks,
  CustomToolbarOptions
} from './custom-toolbar';
import './styles/styles.scss';

/**
 * Custom toolbar example showcases implementation of custom toolbar for PDF Web Viewer.
 * Implementation is done in Vanilla TypeScript.
 * Feel free to use it as an example, but implementation can be done by using any library or framework (React, Angular, Vue...).
 *
 * CustomToolbarState tracks internal component state.
 * CustomToolbarDOM contains interactive HTMLElements that are part of CustomToolbar.
 * CustomToolbarCallbacks are used to invoke PDF Web Viewer methods when user interacts with Custom Toolbar.
 * CustomToolbarOptions are used to customize CustomToolbar behaviour.
 */

const viewerElement = document.querySelector<HTMLDivElement>('#pdfviewer');
const license: string = '';

/**
 * Predefined zoom levels are being passed to both PDF Web Viewer and CustomToolbar.
 * This ensures that both PDF Web Viewer and CustomToolbar react exactly the same on user input.
 * Zooming can be done by using zoom in and out buttons, by using zoom dropdown and by using CTRL + MouseWheel.
 */

const zoomLevels = [
  0.1, 0.15, 0.2, 0.25, 0.35, 0.4, 0.5, 0.65, 0.8, 1, 1.25, 1.5, 2, 2.5, 3, 4
];

const options: Partial<PdfWebViewerOptionsInterface> = {
  viewer: {
    general: {
      user: 'John Doe',
      disableMainToolbar: true,
      disableAnnotationToolbar: false,
      defaultZoomLevels: zoomLevels
    }
  }
};

const pdfViewer = new PdfWebViewer(viewerElement, license, options);

// CustomToolbarCallbacks are used to invoke PDF Web Viewer methods when user interacts with Custom Toolbar

const customToolbarCallbacks: CustomToolbarCallbacks = {
  onUploadFile(file: File) {
    pdfViewer.open({ data: file });
  },
  onDownloadFileButtonClicked() {
    pdfViewer.downloadFile();
  },
  onPageNumberChanged(pageNumber: number) {
    pdfViewer.setPageNumber(pageNumber);
  },
  onToggleInformationPaneButtonClicked() {
    pdfViewer.toggleInformationPane();
  },
  onZoomChanged(zoom: number) {
    pdfViewer.setZoom(zoom);
  },
  onRotationChanged(rotation: number) {
    pdfViewer.setRotation(rotation);
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
    searchString.length > 0
      ? pdfViewer.startSearch(searchString, searchOptions)
      : pdfViewer.endSearch();
  },
  onPrevSearchButtonClicked() {
    pdfViewer.previousSearchMatch();
  },
  onNextSearchButtonClicked() {
    pdfViewer.nextSearchMatch();
  }
};

// CustomToolbarOptions are used to customize CustomToolbar behaviour

const customToolbarOptions: CustomToolbarOptions = {
  defaultZoomLevels: zoomLevels
};

// Custom toolbar instantiation

const customToolbar = new CustomToolbar(
  customToolbarCallbacks,
  customToolbarOptions
);

// PDF Web Viewer event listeners are used to synchronize CustomToolbar state with PDF Web Viewer state

pdfViewer.addEventListener('appLoaded', () => {
  pdfViewer.open({ uri: '/PdfWebViewer.pdf' });
});

pdfViewer.addEventListener('documentLoaded', () => {
  customToolbar.setPageNumber(pdfViewer.getPageNumber());
  customToolbar.setPageCount(pdfViewer.getPageCount());
  customToolbar.setRotation(pdfViewer.getRotation());
});

pdfViewer.addEventListener('pageNumberChanged', (pageNumber: number) => {
  customToolbar.setPageNumber(pageNumber);
});

pdfViewer.addEventListener('fitModeChanged', (fitMode: PdfFitMode) => {
  customToolbar.setFitMode(fitMode);
});

pdfViewer.addEventListener('zoomChanged', (zoom: number) => {
  customToolbar.setZoom(zoom);
});

pdfViewer.addEventListener('rotationChanged', (rotation: number) => {
  customToolbar.setRotation(rotation);
});
