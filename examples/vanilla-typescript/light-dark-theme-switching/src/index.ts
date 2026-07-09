import { PdfToolsViewer } from '@pdftools/pdf-web-viewer';

async function init() {
    const container = document.getElementById('viewer-container')!;
    const viewer = new PdfToolsViewer();

    await viewer.initialize(
        {
            theme: 'auto',
        },
        container
    );

    const btnLight = document.getElementById('btn-light');
    const btnDark = document.getElementById('btn-dark');
    const btnAuto = document.getElementById('btn-auto');
    const status = document.getElementById('status')!;

    function updateStatus() {
        const currentTheme = viewer.getTheme();
        const availableThemes = viewer.getAvailableThemes();
        status.textContent = `Current: ${currentTheme} | Available:           
  ${availableThemes.join(', ')}`;

        document
            .querySelectorAll('.controls button')
            .forEach((btn) => btn.classList.remove('active'));
        if (currentTheme === 'light') btnLight?.classList.add('active');
        if (currentTheme === 'dark') btnDark?.classList.add('active');
    }

    btnLight?.addEventListener('click', () => {
        viewer.setTheme('light');
        updateStatus();
    });
    btnDark?.addEventListener('click', () => {
        viewer.setTheme('dark');
        updateStatus();
    });
    btnAuto?.addEventListener('click', () => {
        viewer.setTheme('auto');
        updateStatus();
    });

    updateStatus();
    console.log('Available themes:', viewer.getAvailableThemes());
    console.log('Current theme:', viewer.getTheme());
}

init();
