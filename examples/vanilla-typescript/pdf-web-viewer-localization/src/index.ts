import { PdfToolsViewer } from '@pdftools/pdf-web-viewer';

async function init() {
  const container = document.getElementById('viewer-container')!;
  const viewer = new PdfToolsViewer();
  await viewer.initialize({
    'locale': 'fr', // Set the locale to French
    'customTranslations': { // Add new language, for example Spanish
      'es': {
        'toolbar.button.open': 'Abrir un document', // Custom translation for the "Open Document" button in Spanish
      }
    }
  }, container);

  // Get the available locales by using the `getAvailableLocales` method
  const availableLocales = viewer.getAvailableLocales();
  console.log('Available Locales:', availableLocales);

  // Override the behavior of the print button to change the locale to Spanish when clicked
  viewer.overrideButtonBehavior('print-button', 'click', () => {
    viewer.setLocale('es'); // Change the locale to Spanish when the print button is clicked
  })
}

init();
