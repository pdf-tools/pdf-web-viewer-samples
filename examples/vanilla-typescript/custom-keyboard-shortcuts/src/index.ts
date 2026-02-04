import {
  PdfWebViewer,
  PdfWebViewerOptionsInterface
} from '@pdftools/four-heights-pdf-web-viewer';

import './styles.scss';

const viewerElement = document.querySelector<HTMLDivElement>('#pdfviewer');
const license: string = '';
const options: Partial<PdfWebViewerOptionsInterface> = {
  viewer: {
    general: {
      user: 'John Doe'
    }
  },
  /**
   * Below are all available keyboard shortcuts with their default assignments
   *
   * [shortcut]: {
   *   key: KeyboardEvent.key,
   *   altKey?: boolean
   *   ctrlKey?: boolean
   *   shiftKey?: boolean
   * } | null,
   *
   * To disable individual shortcuts, null can be assigned to the shortcut
   *
   * A list with all available keys can be found here:
   * https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values
   */
  shortcuts: {
    zoomIn: { key: '+' },
    zoomOut: { key: '-' },
    nextPage: { key: 'PageDown' },
    previousPage: { key: 'PageUp' },
    firstPage: { key: 'Home' },
    lastPage: { key: 'End' },
    scrollUp: { key: 'ArrowUp' },
    scrollDown: { key: 'ArrowDown' },
    scrollLeft: { key: 'ArrowLeft' },
    scrollRight: { key: 'ArrowRight' },
    releaseSelection: { key: 'Escape' },
    copy: {
      key: 'c',
      ctrlKey: true
    },
    print: {
      key: 'p',
      ctrlKey: true
    },
    cancelPrint: {
      key: 'Escape'
    },
    resetZoom: {
      key: 'z',
      altKey: true
    },
    fitToPage: {
      key: 'p',
      altKey: true
    },
    fitToWidth: {
      key: 'w',
      altKey: true
    },
    rotateView: {
      key: 'r',
      altKey: true
    },
    save: {
      key: 's',
      ctrlKey: true
    },
    search: {
      key: 'f',
      ctrlKey: true
    },
    searchNext: { key: 'F3' },
    searchPrevious: {
      key: 'F3',
      shiftKey: true
    },
    closeSearch: { key: 'Escape' },
    toggleSidePane: {
      key: 's',
      altKey: true
    },
    showAnnotations: {
      key: 'a',
      altKey: true
    },
    showOutline: {
      key: 'o',
      altKey: true
    },
    showThumbnails: {
      key: 't',
      altKey: true
    },
    cancelEditAnnotation: { key: 'Escape' }
  }
};

const pdfViewer = new PdfWebViewer(viewerElement, license, options);

pdfViewer.addEventListener('appLoaded', () => {
  pdfViewer.open({ uri: '/PdfWebViewer.pdf' });
});
