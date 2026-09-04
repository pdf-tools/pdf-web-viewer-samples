import { PdfToolsViewer, AnnotationColorsConfig } from '@pdftools/pdf-web-viewer';

const colorPalettes: Record<string, AnnotationColorsConfig> = {
  corporate: {
    default: ['#003366', '#336699', '#6699CC', '#99CCFF', '#CCCCCC', '#666666'],
    inkAnnotation: ['#003366', '#000000', '#333333', '#666666'],
    noteAnnotation: ['#E6F2FF', '#CCE5FF', '#B3D9FF', '#99CCFF'],
    textMarkupAnnotation: ['#FFFF00', '#99CCFF', '#CCFFCC', '#FFE4B5'],
  },
  vibrant: {
    default: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#8B00FF'],
    inkAnnotation: ['#FF0000', '#00FF00', '#0000FF', '#FF00FF'],
    noteAnnotation: ['#FFD700', '#FF69B4', '#00CED1', '#32CD32'],
    textMarkupAnnotation: ['#FF0000', '#00FF00', '#00BFFF', '#FF69B4'],
  },
  pastel: {
    default: ['#FFB3BA', '#FFDFBA', '#FFFFBA', '#BAFFC9', '#BAE1FF', '#E1BAFF'],
    inkAnnotation: ['#DDA0DD', '#87CEEB', '#98FB98', '#F0E68C'],
    noteAnnotation: ['#FFE4E1', '#E6E6FA', '#F0FFF0', '#FFF0F5'],
    textMarkupAnnotation: ['#FFDAB9', '#E0FFFF', '#FFFACD', '#D8BFD8'],
  },
};

async function init() {
  const container = document.getElementById('viewer-container')!;
  const viewer = new PdfToolsViewer();

  // Initialize with corporate palette
  await viewer.initialize({
    annotationColors: colorPalettes.corporate,
  }, container);

  // Button references
  const buttons = {
    corporate: document.getElementById('btn-corporate')!,
    vibrant: document.getElementById('btn-vibrant')!,
    pastel: document.getElementById('btn-pastel')!,
  };

  // Switch palette and update active button
  function switchPalette(palette: string) {
    viewer.setAnnotationColors(colorPalettes[palette]);
    Object.keys(buttons).forEach(btnKey => buttons[btnKey as keyof typeof buttons].classList.remove('active'));
    buttons[palette as keyof typeof buttons].classList.add('active');
  }

  // Wire up buttons
  buttons.corporate.addEventListener('click', () => switchPalette('corporate'));
  buttons.vibrant.addEventListener('click', () => switchPalette('vibrant'));
  buttons.pastel.addEventListener('click', () => switchPalette('pastel'));
}

init();
