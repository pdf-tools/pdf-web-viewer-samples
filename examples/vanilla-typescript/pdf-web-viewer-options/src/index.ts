import {
  FreetextAnnotationModule,
  HighlightAnnotationModule,
  ImageAnnotationModule,
  InkAnnotationModule,
  PdfPageLayoutMode,
  PdfWebViewer,
  PdfWebViewerOptionsInterface,
  ShapeAnnotationModule,
  StampAnnotationModule,
  TextAnnotationModule
} from '@pdftools/four-heights-pdf-web-viewer';

import './styles.scss';

const viewerElement = document.querySelector<HTMLDivElement>('#pdfviewer');
const license: string = '';
const options: Partial<PdfWebViewerOptionsInterface> = {
  viewer: {
    general: {
      user: 'John Doe',
      language: 'en',
      annotationBarPosition: 'left',
      promptOnUnsavedChange: true,
      searchMatchColor: '#3ABCFF',
      textSelectionColor: '#006395',
      rectangularTextSelection: 'automatic',
      pageLayoutModes: [
        PdfPageLayoutMode.ONE_COLUMN,
        PdfPageLayoutMode.SINGLE_PAGE,
        PdfPageLayoutMode.TWO_COLUMN_LEFT,
        PdfPageLayoutMode.TWO_COLUMN_RIGHT,
        PdfPageLayoutMode.TWO_PAGE_LEFT,
        PdfPageLayoutMode.TWO_PAGE_RIGHT
      ],
      defaultZoomLevels: [
        0.1, 0.15, 0.2, 0.25, 0.35, 0.4, 0.5, 0.65, 0.8, 1, 1.25, 1.5, 2.0, 2.5, 3.0,
        4.0
      ],
      tooltips: 'title',
      viewOnly: false
    },
    sidebar: {
      thumbnailNavigation: true,
      outlineNavigation: true,
      annotationNavigation: {
        textMarkup: {
          preview: 'short'
        }
      }
    },
    permissions: {
      allowOpenFile: true,
      allowCloseFile: false,
      allowFileDrop: true,
      allowPrinting: false,
      allowSaveFile: true,
      enableSearch: true
    },
    customButtons: {
      annotationbar: [
        {
          text: 'Open from Dropbox',
          icon: '/images/dropbox.svg',
          onClick: () => {
            alert('Annotation bar dropbox button clicked');
          }
        }
      ],
      documentbar: [
        {
          text: 'Open from Dropbox',
          icon: '/images/dropbox.svg',
          onClick: () => {
            alert('Document bar dropbox button clicked');
          }
        }
      ],
      informationbar: [
        {
          text: 'Open from Dropbox',
          icon: '/images/dropbox.svg',
          onClick: () => {
            alert('Information bar dropbox button clicked');
          }
        }
      ]
    },
    callbacks: {
      // onOpenFileButtonClicked: () => {},
      // onSaveFileButtonClicked: () => {},
      // onFileButtonClicked: () => {},
    }
  },
  annotation: {
    colors: {
      highlightColors: ['#2ADB1A', '#FFEA02', '#FF7F1F', '#FF2882', '#008AD1'],
      backgroundColors: [
        '#FFFFFF',
        '#FCF5E2',
        '#323232',
        '#FFEA02',
        '#D82F32',
        '#0066CC77'
      ],
      foregroundColors: [
        '#323232',
        '#FFFFFF',
        '#FFEA02',
        '#2ADB1A',
        '#0066CC',
        '#D82F3277'
      ],
      defaultHighlightColor: '#FFEA02',
      defaultBackgroundColor: '#FCF5E2',
      defaultForegroundColor: '#323232'
    },
    // stamps: [],
    fonts: {
      fontFamilies: ['Helvetica', 'Times', 'Courier', 'Symbol', 'ZapfDingbats'],
      fontSizes: [9, 10, 12, 14, 16, 18, 20, 24],
      defaultFontFamily: 'Helvetica',
      defaultFontSize: 12
    },
    highlightOpacity: 0.5,
    strokeWidths: [0, 1, 2, 3, 5, 8, 13, 21],
    defaultStampWidth: 120,
    defaultBorderWidth: 1,
    hideAnnotationSubject: false,
    trackHistory: false,
    onlyAuthorCanEdit: false,
    hideOnDelete: false,
    selectedStamp: 0
  },
  forms: {
    enabled: true
  },
  modules: [
    InkAnnotationModule,
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
