import { PdfToolsViewer } from '@pdftools/pdf-web-viewer';

async function init() {
    const container = document.getElementById('viewer-container')!;
    const viewer = new PdfToolsViewer();

    await viewer.initialize(
        {
            customThemes: {
                corporate: {
                    accent: { default: '#003366', subtle: '#E6EDF5' },
                    control: {
                        primaryBg: '#003366',
                        primaryHoverBg: '#004488',
                        primaryActiveBg: '#002244',
                        primaryText: '#FFFFFF',
                    },
                },
                sunset: {
                    surface: {
                        primary: '#FFF8F0',
                        secondary: '#FFE8D6',
                        selected: '#FFCBA4',
                    },
                    accent: { default: '#FF6B35', subtle: '#FFE8D6' },
                    control: {
                        primaryBg: '#FF6B35',
                        primaryHoverBg: '#E85A2A',
                        primaryActiveBg: '#D14D20',
                    },
                },
                'forest-dark': {
                    surface: {
                        primary: '#1A2F1A',
                        secondary: '#2A3F2A',
                        tertiary: '#0F1F0F',
                    },
                    text: { primary: '#E8F5E9', secondary: '#A5D6A7' },
                    accent: { default: '#4CAF50', subtle: '#1B5E20' },
                    control: { primaryBg: '#4CAF50', primaryText: '#000000' },
                },
            },
            theme: 'corporate',
        },
        container
    );

    const themes = ['light', 'dark', 'corporate', 'sunset', 'forest-dark'];
    const status = document.getElementById('status')!;

    function updateStatus() {
        const current = viewer.getTheme();
        status.textContent = `Theme: ${current}`;
        document.querySelectorAll('.controls button').forEach((btn) => {
            btn.classList.toggle('active', btn.id === `btn-${current}`);
        });
    }

    themes.forEach((theme) => {
        document
            .getElementById(`btn-${theme}`)
            ?.addEventListener('click', () => {
                viewer.setTheme(theme);
                updateStatus();
            });
    });

    updateStatus();
    console.log('Available themes:', viewer.getAvailableThemes());

    // @NOTE: Here's how you can add a new custom theme programmatically.
    // viewer.addTheme('purple-accent', {
    //     accent: { default: '#9B59B6' }
    // });
    // viewer.setTheme('purple-accent');
    // updateStatus();
    // console.log('Purple-accent theme added (minimal, defaults to light base)');
}

init();
