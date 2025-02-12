import { pdfToolsWebSdk, Pdf, UI } from '@pdftools/pdf-web-sdk';
import { CustomTextSelectionPlugin } from './custom-text-selection-plugin/CustomTextSelectionPlugin';

async function init() {
  // Initialize web sdk

  await pdfToolsWebSdk.initialize();
  const container = document.getElementById('viewer-container');
  const documentView = new UI.DocumentView(container);

  const controllerOptions = {
    licenseKey: pdfToolsWebSdk.licenseKey,
    producerSuffix: pdfToolsWebSdk.producerSuffix,
    licensingUrl: pdfToolsWebSdk.licenseUrl
  };

  const controller = new Pdf.Controller(controllerOptions);

  await controller.initialize();

  let doc = await controller.openDocument({
    uri: '../pdf/WebViewer_Demo.pdf'
  });

  documentView.initialize(doc);

  // Plugin manager is used to track registered plugins and makes sure that only one plugin is active at the time.

  const pluginManager = new UI.PluginManager();

  // Register default text selection plugin

  const textSelectionPlugin = new UI.TextSelectionPlugin(documentView);
  pluginManager.registerPlugin(textSelectionPlugin);
  pluginManager.activatePlugin(textSelectionPlugin);
  textSelectionPlugin.addEventListener('textSelectionChanged', (text) => {
    console.log(`TextSelectionPlugin -> ${text}`);
  });

  // Register custom text selection plugin

  const customTextSelectionPlugin = new CustomTextSelectionPlugin(documentView);
  pluginManager.registerPlugin(customTextSelectionPlugin);
  customTextSelectionPlugin.addEventListener('textSelectionChanged', (text) => {
    console.log(`CustomTextSelectionPlugin -> ${text}`);
  });

  // Attach button events for switching between plugins

  const textSelectionPluginButton = document.getElementById(
    'textSelectionPluginButton'
  );
  textSelectionPluginButton.addEventListener('click', () => {
    pluginManager.activatePlugin(textSelectionPlugin);
  });

  const customTextSelectionPluginButton = document.getElementById(
    'customTextSelectionPluginButton'
  );
  customTextSelectionPluginButton.addEventListener('click', () => {
    pluginManager.activatePlugin(customTextSelectionPlugin);
  });
}

init();
