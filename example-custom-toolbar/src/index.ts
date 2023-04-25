import { PdfWebViewer, PdfWebViewerOptionsInterface } from '@pdf-tools/four-heights-pdf-web-viewer'
import 'material-icons/iconfont/material-icons.css';
import './styles.scss'

const viewerElement = document.getElementById('pdfviewer')
const license = ''
const options: Partial<PdfWebViewerOptionsInterface> = {
  viewer: {
    general: {
      user: 'John Doe',
      disableMainToolbar: false,
      disableAnnotationToolbar: true,
    },
  },
}

const pdfViewer = new PdfWebViewer(viewerElement, license, options)

pdfViewer.addEventListener('appLoaded', function () {
  pdfViewer.open({ uri: '/PdfWebViewer.pdf' })
})

export enum SecondaryToolbarType {
  SEARCH = 'search',
  ZOOM = 'zoom',
  LAYOUT = 'layout',
};

interface State {
  secondaryToolbar: Record<SecondaryToolbarType, any>;
}

const state = {
  layoutDropdown: {
    opened: false,
  },
  secondaryToolbar: {
    search: {
      opened: false,
    },
    zoom: {
      opened: false,
    },
    layout: {
      opened: false,
    }
  }
};

function setOpenedSecondaryToolbar(secondaryToolbarType: SecondaryToolbarType, isOpened: boolean) {
  state.secondaryToolbar[secondaryToolbarType].opened = isOpened;
}

function refreshSecondaryToolbars() {
  const secondaryToolbars = getSecondaryToolbars();
  secondaryToolbars.forEach((secondaryToolbar) => {
    switch (secondaryToolbar.id) {
      case 'search-toolbar': secondaryToolbar.style.display = state.secondaryToolbar.search.opened ? 'flex' : 'none'; break;
      case 'zoom-toolbar': secondaryToolbar.style.display = state.secondaryToolbar.zoom.opened ? 'flex' : 'none'; break;
      case 'layout-toolbar': secondaryToolbar.style.display = state.secondaryToolbar.layout.opened ? 'flex' : 'none'; break;
      default: throw new Error('Unhandled secondary toolbar id');
    }
  })
}

function getSecondaryToolbars(): NodeListOf<HTMLDivElement> {
  return document.querySelectorAll('.secondary-toolbar');
}

function toggleLayoutDropdown(layoutDropdown: HTMLDivElement) {
  const dropdownOptions: HTMLDivElement = layoutDropdown.querySelector('.dropdown-options');
  state.layoutDropdown.opened = !state.layoutDropdown.opened;
  dropdownOptions.style.display = state.layoutDropdown.opened ? 'flex' : 'none';
}

function init() {
  const toggleSearchButton = document.getElementById('toggle-search-button');
  const toggleZoomButton = document.getElementById('toggle-zoom-button');
  const toggleLayoutButton = document.getElementById('toggle-layout-button');

  toggleSearchButton.onclick = () => {
    setOpenedSecondaryToolbar(SecondaryToolbarType.SEARCH, !state.secondaryToolbar.search.opened);
    setOpenedSecondaryToolbar(SecondaryToolbarType.ZOOM, false);
    setOpenedSecondaryToolbar(SecondaryToolbarType.LAYOUT, false);
    refreshSecondaryToolbars();
  }
  
  toggleZoomButton.onclick = () => {
    setOpenedSecondaryToolbar(SecondaryToolbarType.SEARCH, false);
    setOpenedSecondaryToolbar(SecondaryToolbarType.ZOOM, !state.secondaryToolbar.zoom.opened);
    setOpenedSecondaryToolbar(SecondaryToolbarType.LAYOUT, false);
    refreshSecondaryToolbars();
  }
  
  toggleLayoutButton.onclick = () => {
    setOpenedSecondaryToolbar(SecondaryToolbarType.SEARCH, false);
    setOpenedSecondaryToolbar(SecondaryToolbarType.ZOOM, false);
    setOpenedSecondaryToolbar(SecondaryToolbarType.LAYOUT, !state.secondaryToolbar.layout.opened);
    refreshSecondaryToolbars();
  }

  const layoutDropdown: HTMLDivElement = document.querySelector('#layout-dropdown');
  const layoutDropdownButton: HTMLButtonElement = layoutDropdown.querySelector('.dropdown-button');
  const layoutDropdownOptions: NodeListOf<HTMLDivElement> = layoutDropdown.querySelectorAll('.dropdown-option');

  layoutDropdownOptions.forEach((dropdownOption) => {
    dropdownOption.addEventListener('click', () => {
      console.log(dropdownOption.dataset);
    })
  });

  layoutDropdownButton.onclick = () => {
    toggleLayoutDropdown(layoutDropdown);
  };

  document.addEventListener('click', (event) => {
    if (state.layoutDropdown.opened && !layoutDropdown.contains(event.target as Node)) {
      toggleLayoutDropdown(layoutDropdown);
    }
  })
}

init();