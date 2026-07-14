import { PdfToolsViewer } from '@pdftools/pdf-web-viewer';

async function init() {
  const container = document.getElementById('viewer-container')!;
  const viewer = new PdfToolsViewer();
  await viewer.initialize({}, container);

  // Option 1: Use the `save` method to save annotations as FDF
  viewer.overrideButtonBehavior('save-button', 'click', async () => {
    const blob = await viewer.document.save({ saveAsFdf: true });                 
    const file = new File([blob], 'form-data.fdf', { type: 'application/fdf' });  
                                                                                  
    // Create download link                                                       
    const url = URL.createObjectURL(file);                                        
    const link = document.createElement('a');                                     
    link.href = url;                                                              
    link.download = 'form-data.fdf';                                              
    link.click();                                                                 
    URL.revokeObjectURL(url); 
  });

  // Option 2: Use the `download` method to save annotations as FDF
  // viewer.overrideButtonBehavior('save-button', 'click', () => {
  //   viewer.document.download('example.fdf', {
  //     'saveAsFdf': true,
  //   });
  // });
}

init();
