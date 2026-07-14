import { PdfToolsViewer } from '@pdftools/pdf-web-viewer';

/**
 * Creates a button element with a hidden file input for image selection.
 * @returns {HTMLButtonElement} The created button element.
 */
function createFileInputButton(): HTMLButtonElement {
  // Create and insert a button in annotation toolbar
  const buttonEl = document.createElement('button');
  buttonEl.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#FF0000" class="bi bi-camera" viewBox="0 0 16 16">
          <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4z"/>
          <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5m0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7M3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"/>
      </svg>
  `;
  buttonEl.style.cssText =
      'all: unset; width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center;';
  buttonEl.title = 'Custom File Input Button';
  return buttonEl;
}

/**
 * Appends the given button to the viewer's annotation toolbar.
 * @param {HTMLButtonElement} button - The button element to append.
 * @returns {void}
 */
function appendButtonToToolbar(button: HTMLButtonElement): void {
  const pdfToolsViewerEl = document.querySelector("pdftools-viewer")!;
  const pdfToolsAnnotationToolbarEl = pdfToolsViewerEl.shadowRoot?.querySelector(
      "pdftools-annotation-toolbar"
  );
  pdfToolsAnnotationToolbarEl?.shadowRoot
      ?.querySelector(".pdftools-annotation-toolbar")
      ?.appendChild(button);
}

async function init() {
  const container = document.getElementById('viewer-container')!;
  const viewer = new PdfToolsViewer();
  await viewer.initialize({}, container);

  // Create a custom file input button and append it to the toolbar
  const button = createFileInputButton();
  button.addEventListener('click', () => {
    alert('Custom file input button clicked!');
  })
  appendButtonToToolbar(button);
}

init();
