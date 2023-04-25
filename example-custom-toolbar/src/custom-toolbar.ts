interface State {
    layoutDropdownOpened: boolean;
    layoutDropdownValue: string;
    zoomDropdownOpened: boolean;
    zoomDropdownValue: number;
    searchToolbarOpened: boolean;
    zoomToolbarOpened: boolean;
    layoutToolbarOpened: boolean;
}
  
const initialState = {
    layoutDropdownOpened: false,
    layoutDropdownValue: 'one-column',
    zoomDropdownOpened: false,
    zoomDropdownValue: 100,
    searchToolbarOpened: false,
    zoomToolbarOpened: false,
    layoutToolbarOpened: false,
};

interface DOM {
    uploadFileButton: HTMLButtonElement;
    downloadFileButton: HTMLButtonElement;
    toggleSidePaneButton: HTMLButtonElement;
    prevPageButton: HTMLButtonElement;
    nextPageButton: HTMLButtonElement;
    toggleSearchToolbarButton: HTMLButtonElement;
    toggleZoomToolbarButton: HTMLButtonElement;
    toggleLayoutToolbarButton: HTMLButtonElement;
    searchToolbar: HTMLDivElement;
    prevSearchMatchButton: HTMLButtonElement;
    nextSearchMatchButton: HTMLButtonElement;
    zoomToolbar: HTMLDivElement;
    zoomInButton: HTMLButtonElement;
    zoomOutButton: HTMLButtonElement;
    zoomDropdown: HTMLDivElement;
    zoomDropdownButton: HTMLDivElement,
    zoomDropdownOptionsContainer: HTMLDivElement,
    zoomDropdownOptions: NodeListOf<HTMLDivElement>,
    layoutToolbar: HTMLDivElement;
    toggleFitButton: HTMLButtonElement;
    rotatePageButton: HTMLButtonElement;
    layoutDropdown: HTMLDivElement;
    layoutDropdownButton: HTMLDivElement,
    layoutDropdownOptionsContainer: HTMLDivElement,
    layoutDropdownOptions: NodeListOf<HTMLDivElement>,
}

export default class CustomToolbar {
  private state: State;
  private dom: DOM;

  constructor() {
    this.state = { ...initialState };
    this.dom = {
      uploadFileButton: document.getElementById('upload-file-button') as HTMLButtonElement,
      downloadFileButton: document.getElementById('download-file-button') as HTMLButtonElement,
      toggleSidePaneButton: document.getElementById('toggle-side-pane-button') as HTMLButtonElement,
      prevPageButton: document.getElementById('prev-page-button') as HTMLButtonElement,
      nextPageButton: document.getElementById('next-page-button') as HTMLButtonElement,
      toggleSearchToolbarButton: document.getElementById('toggle-search-toolbar-button') as HTMLButtonElement,
      toggleZoomToolbarButton: document.getElementById('toggle-zoom-toolbar-button') as HTMLButtonElement,
      toggleLayoutToolbarButton: document.getElementById('toggle-layout-toolbar-button') as HTMLButtonElement,
      searchToolbar: document.getElementById('search-toolbar') as HTMLDivElement,
      prevSearchMatchButton: document.getElementById('prev-search-match-button') as HTMLButtonElement,
      nextSearchMatchButton: document.getElementById('next-search-match-button') as HTMLButtonElement,
      zoomToolbar: document.getElementById('zoom-toolbar') as HTMLDivElement,
      zoomInButton: document.getElementById('zoom-in-button') as HTMLButtonElement,
      zoomOutButton: document.getElementById('zoom-out-button') as HTMLButtonElement,
      zoomDropdown: document.getElementById('zoom-dropdown') as HTMLDivElement,
      zoomDropdownButton: document.querySelector('#zoom-dropdown .dropdown-button') as HTMLDivElement,
      zoomDropdownOptionsContainer: document.querySelector('#zoom-dropdown .dropdown-options-container') as HTMLDivElement,
      zoomDropdownOptions: document.querySelectorAll('#zoom-dropdown .dropdown-options-container .dropdown-option') as NodeListOf<HTMLDivElement>,
      layoutToolbar: document.getElementById('layout-toolbar') as HTMLDivElement,
      toggleFitButton: document.getElementById('toggle-fit-button') as HTMLButtonElement,
      rotatePageButton: document.getElementById('rotate-page-button') as HTMLButtonElement,
      layoutDropdown: document.getElementById('layout-dropdown') as HTMLDivElement,
      layoutDropdownButton: document.querySelector('#layout-dropdown .dropdown-button') as HTMLDivElement,
      layoutDropdownOptionsContainer: document.querySelector('#layout-dropdown .dropdown-options-container') as HTMLDivElement,
      layoutDropdownOptions: document.querySelectorAll('#layout-dropdown .dropdown-options-container .dropdown-option') as NodeListOf<HTMLDivElement>,
    };
  }

  init() {
    this.initDropdowns();

    this.dom.toggleSearchToolbarButton.addEventListener('click', this.handleToggleSearchToolbarButtonClicked.bind(this));
    this.dom.toggleZoomToolbarButton.addEventListener('click', this.handleToggleZoomToolbarButtonClicked.bind(this));
    this.dom.toggleLayoutToolbarButton.addEventListener('click', this.handleToggleLayoutToolbarButtonClicked.bind(this));
  }

  private initDropdowns() {
    this.dom.zoomDropdownButton.addEventListener('click', () => {
      this.state.zoomDropdownOpened = !this.state.zoomDropdownOpened;
      this.refreshDropdowns();
    });

    this.dom.zoomDropdownOptions.forEach((dropdownOption) => {
      dropdownOption.addEventListener('click', () => {
        console.log(dropdownOption.dataset);
        this.state.zoomDropdownOpened = !this.state.zoomDropdownOpened;
        this.refreshDropdowns();
      });
    });
  
    this.dom.layoutDropdownButton.addEventListener('click', () => {
      this.state.layoutDropdownOpened = !this.state.layoutDropdownOpened;
      this.refreshDropdowns();
    });

    this.dom.layoutDropdownOptions.forEach((dropdownOption) => {
      dropdownOption.addEventListener('click', () => {
        console.log(dropdownOption.dataset);
        this.state.layoutDropdownOpened = !this.state.layoutDropdownOpened;
        this.refreshDropdowns();
      });
    });
  
    document.addEventListener('click', (event) => {
      if (this.state.zoomDropdownOpened && !this.dom.zoomDropdown.contains(event.target as Node)) {
        this.state.zoomDropdownOpened = false;
        this.refreshDropdowns();
      }
      if (this.state.layoutDropdownOpened && !this.dom.layoutDropdown.contains(event.target as Node)) {
        this.state.layoutDropdownOpened = false;
        this.refreshDropdowns();
      }
    });
  }

  private handleToggleSearchToolbarButtonClicked() {
    this.state.searchToolbarOpened = !this.state.searchToolbarOpened;
    this.state.zoomToolbarOpened = false;
    this.state.layoutToolbarOpened = false;
    this.refreshSecondaryToolbars();
  }
  
  private handleToggleZoomToolbarButtonClicked() {
    this.state.searchToolbarOpened = false;
    this.state.zoomToolbarOpened = !this.state.zoomDropdownOpened;
    this.state.layoutToolbarOpened = false;
    this.refreshSecondaryToolbars();
  }
  
  private handleToggleLayoutToolbarButtonClicked() {
    this.state.searchToolbarOpened = false;
    this.state.zoomToolbarOpened = false;
    this.state.layoutToolbarOpened = !this.state.layoutToolbarOpened;
    this.refreshSecondaryToolbars();
  }

  private refreshSecondaryToolbars() {
    this.dom.searchToolbar.style.display = this.state.searchToolbarOpened ? 'flex' : 'none';
    this.dom.zoomToolbar.style.display = this.state.zoomToolbarOpened ? 'flex' : 'none';
    this.dom.layoutToolbar.style.display = this.state.layoutToolbarOpened ? 'flex' : 'none';
  }
  
  private refreshDropdowns() {
    this.dom.zoomDropdownOptionsContainer.style.display = this.state.zoomDropdownOpened ? 'flex' : 'none';
    this.dom.layoutDropdownOptionsContainer.style.display = this.state.layoutDropdownOpened ? 'flex' : 'none';
  }
}