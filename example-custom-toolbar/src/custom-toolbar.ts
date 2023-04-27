import { PdfFitMode, PdfPageLayoutMode, SearchOptions } from "@pdf-tools/four-heights-pdf-web-viewer";

interface CustomToolbarState {
  informationPaneOpened: boolean;
  pageNumber: number;
  pageCount: number;
  fitMode: PdfFitMode;
  layoutDropdownOpened: boolean;
  layoutDropdownValue: PdfPageLayoutMode;
  zoomDropdownOpened: boolean;
  zoomDropdownValue: number;
  searchToolbarOpened: boolean;
  zoomToolbarOpened: boolean;
  layoutToolbarOpened: boolean;
}
  
const initialState: CustomToolbarState = {
  informationPaneOpened: false,
  pageNumber: 1,
  pageCount: 1,
  layoutDropdownOpened: false,
  fitMode: PdfFitMode.NONE,
  layoutDropdownValue: PdfPageLayoutMode.ONE_COLUMN,
  zoomDropdownOpened: false,
  zoomDropdownValue: 100,
  searchToolbarOpened: false,
  zoomToolbarOpened: false,
  layoutToolbarOpened: false,
};

interface CustomToolbarDOM {
  uploadFileButton: HTMLButtonElement;
  uploadFileInput: HTMLInputElement;
  downloadFileButton: HTMLButtonElement;
  toggleInformationPaneButton: HTMLButtonElement;
  pageNumberInput: HTMLInputElement;
  pageCount: HTMLSpanElement;
  prevPageButton: HTMLButtonElement;
  nextPageButton: HTMLButtonElement;
  toggleSearchToolbarButton: HTMLButtonElement;
  toggleZoomToolbarButton: HTMLButtonElement;
  toggleLayoutToolbarButton: HTMLButtonElement;
  searchToolbar: HTMLDivElement;
  searchInput: HTMLInputElement;
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
  rotateViewerButton: HTMLButtonElement;
  layoutDropdown: HTMLDivElement;
  layoutDropdownButton: HTMLDivElement,
  layoutDropdownOptionsContainer: HTMLDivElement,
  layoutDropdownOptions: NodeListOf<HTMLDivElement>,
}

interface CustomToolbarCallbacks {
  onUploadFile?: (file: File) => void;
  onDownloadFileButtonClicked?: () => void;
  onPageNumberChanged?: (pageNumber: number) => void;
  onToggleInformationPaneButtonClicked?: (visible: boolean) => void;
  onToggleSearchClicked?: (active: boolean) => void;
  onSearchParamsChanged?: (searchString: string, searchOptions?: SearchOptions) => void;
  onPrevSearchButtonClicked?: () => void;
  onNextSearchButtonClicked?: () => void;
  onZoomChanged?: (zoom: number) => void;
  onFitModeChanged?: (fitMode: PdfFitMode) => void;
  onRotateViewerButtonClicked?: () => void;
  onLayoutModeChanged?: (layoutMode: PdfPageLayoutMode) => void;
}

export default class CustomToolbar {
  private state: CustomToolbarState;
  private dom: CustomToolbarDOM;
  private callbacks: CustomToolbarCallbacks;

  private readonly ZOOM_OPTIONS = [ 10, 15, 20, 25, 35, 40, 50, 65, 80, 100, 125, 150, 200, 250, 300, 400 ];

  constructor(callbacks?: CustomToolbarCallbacks) {
    this.state = { ...initialState };
    this.dom = {
      uploadFileButton: document.getElementById('upload-file-button') as HTMLButtonElement,
      uploadFileInput: document.getElementById('upload-file-input') as HTMLInputElement,
      downloadFileButton: document.getElementById('download-file-button') as HTMLButtonElement,
      toggleInformationPaneButton: document.getElementById('toggle-information-pane-button') as HTMLButtonElement,
      pageNumberInput: document.getElementById('page-number-input') as HTMLInputElement,
      pageCount: document.getElementById('page-count') as HTMLSpanElement,
      prevPageButton: document.getElementById('prev-page-button') as HTMLButtonElement,
      nextPageButton: document.getElementById('next-page-button') as HTMLButtonElement,
      toggleSearchToolbarButton: document.getElementById('toggle-search-toolbar-button') as HTMLButtonElement,
      toggleZoomToolbarButton: document.getElementById('toggle-zoom-toolbar-button') as HTMLButtonElement,
      toggleLayoutToolbarButton: document.getElementById('toggle-layout-toolbar-button') as HTMLButtonElement,
      searchToolbar: document.getElementById('search-toolbar') as HTMLDivElement,
      searchInput: document.getElementById('search-input') as HTMLInputElement,
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
      rotateViewerButton: document.getElementById('rotate-viewer-button') as HTMLButtonElement,
      layoutDropdown: document.getElementById('layout-dropdown') as HTMLDivElement,
      layoutDropdownButton: document.querySelector('#layout-dropdown .dropdown-button') as HTMLDivElement,
      layoutDropdownOptionsContainer: document.querySelector('#layout-dropdown .dropdown-options-container') as HTMLDivElement,
      layoutDropdownOptions: document.querySelectorAll('#layout-dropdown .dropdown-options-container .dropdown-option') as NodeListOf<HTMLDivElement>,
    };
    this.callbacks = { ...callbacks };

    this.handleUploadFileButtonClicked = this.handleUploadFileButtonClicked.bind(this);
    this.handleUploadFileInputChanged = this.handleUploadFileInputChanged.bind(this);
    this.handleDownloadFileButtonClicked = this.handleDownloadFileButtonClicked.bind(this);
    this.handlePageNumberInputChanged = this.handlePageNumberInputChanged.bind(this);
    this.handlePrevPageButtonClicked = this.handlePrevPageButtonClicked.bind(this);
    this.handleNextPageButtonClicked = this.handleNextPageButtonClicked.bind(this);
    this.handleToggleInformationPaneButtonClicked = this.handleToggleInformationPaneButtonClicked.bind(this);
    this.handleToggleSearchToolbarButtonClicked = this.handleToggleSearchToolbarButtonClicked.bind(this);
    this.handleToggleZoomToolbarButtonClicked = this.handleToggleZoomToolbarButtonClicked.bind(this);
    this.handleToggleLayoutToolbarButtonClicked = this.handleToggleLayoutToolbarButtonClicked.bind(this);
    this.handleSearchInputInput = this.handleSearchInputInput.bind(this);
    this.handleSearchInputKeypress = this.handleSearchInputKeypress.bind(this);
    this.handlePrevSearchMatchClicked = this.handlePrevSearchMatchClicked.bind(this);
    this.handleNextSearchMatchClicked = this.handleNextSearchMatchClicked.bind(this);
    this.handleZoomInButtonClicked = this.handleZoomInButtonClicked.bind(this);
    this.handleZoomOutButtonClicked = this.handleZoomOutButtonClicked.bind(this);
    this.handleZoomDropdownButtonClicked = this.handleZoomDropdownButtonClicked.bind(this);
    this.handleZoomDropdownOptionClicked = this.handleZoomDropdownOptionClicked.bind(this);
    this.handleToggleFitButtonClicked = this.handleToggleFitButtonClicked.bind(this);
    this.handleRotateViewerButtonClicked = this.handleRotateViewerButtonClicked.bind(this);
    this.handleLayoutDropdownButtonClicked = this.handleLayoutDropdownButtonClicked.bind(this);
    this.handleLayoutDropdownOptionClicked = this.handleLayoutDropdownOptionClicked.bind(this);
    this.handleDropdownOutsideClick = this.handleDropdownOutsideClick.bind(this);
    this.handleWindowResize = this.handleWindowResize.bind(this);

    this.init();
  }

  destroy() {
    this.dom.uploadFileButton.removeEventListener('click', this.handleUploadFileButtonClicked);
    this.dom.uploadFileInput.removeEventListener('change', this.handleUploadFileInputChanged);
    this.dom.uploadFileButton.removeEventListener('click', this.handleUploadFileButtonClicked);
    this.dom.pageNumberInput.removeEventListener('change', this.handlePageNumberInputChanged);
    this.dom.prevPageButton.removeEventListener('click', this.handlePrevPageButtonClicked);
    this.dom.nextPageButton.removeEventListener('click', this.handleNextPageButtonClicked);
    this.dom.toggleInformationPaneButton.removeEventListener('click', this.handleToggleInformationPaneButtonClicked);
    this.dom.toggleSearchToolbarButton.removeEventListener('click', this.handleToggleSearchToolbarButtonClicked);
    this.dom.toggleZoomToolbarButton.removeEventListener('click', this.handleToggleZoomToolbarButtonClicked);
    this.dom.searchInput.removeEventListener('input', this.handleSearchInputInput);
    this.dom.searchInput.removeEventListener('keypress', this.handleSearchInputKeypress);
    this.dom.prevSearchMatchButton.removeEventListener('click', this.handlePrevSearchMatchClicked);
    this.dom.nextSearchMatchButton.removeEventListener('click', this.handleNextSearchMatchClicked);
    this.dom.zoomInButton.removeEventListener('click', this.handleZoomInButtonClicked);
    this.dom.zoomOutButton.removeEventListener('click', this.handleZoomOutButtonClicked);
    this.dom.toggleFitButton.removeEventListener('click', this.handleToggleFitButtonClicked);
    this.dom.rotateViewerButton.removeEventListener('click', this.handleRotateViewerButtonClicked);
    this.dom.toggleLayoutToolbarButton.removeEventListener('click', this.handleToggleLayoutToolbarButtonClicked);
    window.addEventListener('resize', this.handleWindowResize);
    this.destroyDropdowns();
  }

  setPageNumber(pageNumber: number) {
    this.state.pageNumber = pageNumber;
    this.dom.pageNumberInput.value = pageNumber.toString();
    this.refreshPaginationButtons();
  }

  setPageCount(pageCount: number) {
    this.state.pageCount = pageCount;
    this.dom.pageCount.innerText = pageCount.toString();
    this.refreshPaginationButtons();
  }

  setFitMode(fitMode: PdfFitMode) {
    this.state.fitMode = fitMode;
    this.refreshFitModeIcon();
  }

  setZoom(zoom: number) {
    this.state.zoomDropdownValue = zoom;

    const dropdownValue = this.dom.zoomDropdown.querySelector('.dropdown-value') as HTMLSpanElement;
    dropdownValue.innerText = `${zoom}%`;

    this.refreshZoomButtons();
  }

  private init() {
    this.dom.uploadFileButton.addEventListener('click', this.handleUploadFileButtonClicked);
    this.dom.uploadFileInput.addEventListener('change', this.handleUploadFileInputChanged);
    this.dom.downloadFileButton.addEventListener('click', this.handleDownloadFileButtonClicked);
    this.dom.pageNumberInput.addEventListener('change', this.handlePageNumberInputChanged);
    this.dom.prevPageButton.addEventListener('click', this.handlePrevPageButtonClicked);
    this.dom.nextPageButton.addEventListener('click', this.handleNextPageButtonClicked);
    this.dom.toggleInformationPaneButton.addEventListener('click', this.handleToggleInformationPaneButtonClicked);
    this.dom.toggleSearchToolbarButton.addEventListener('click', this.handleToggleSearchToolbarButtonClicked);
    this.dom.toggleZoomToolbarButton.addEventListener('click', this.handleToggleZoomToolbarButtonClicked);
    this.dom.searchInput.addEventListener('input', this.handleSearchInputInput);
    this.dom.searchInput.addEventListener('keypress', this.handleSearchInputKeypress);
    this.dom.prevSearchMatchButton.addEventListener('click', this.handlePrevSearchMatchClicked);
    this.dom.nextSearchMatchButton.addEventListener('click', this.handleNextSearchMatchClicked);
    this.dom.zoomInButton.addEventListener('click', this.handleZoomInButtonClicked);
    this.dom.zoomOutButton.addEventListener('click', this.handleZoomOutButtonClicked);
    this.dom.toggleFitButton.addEventListener('click', this.handleToggleFitButtonClicked);
    this.dom.rotateViewerButton.addEventListener('click', this.handleRotateViewerButtonClicked);
    this.dom.toggleLayoutToolbarButton.addEventListener('click', this.handleToggleLayoutToolbarButtonClicked);
    window.addEventListener('resize', this.handleWindowResize);
    this.initDropdowns();
  }

  private initDropdowns() {
    this.dom.zoomDropdownButton.addEventListener('click', this.handleZoomDropdownButtonClicked);

    this.dom.zoomDropdownOptions.forEach((dropdownOption) => {
      dropdownOption.addEventListener('click', this.handleZoomDropdownOptionClicked);
    });

    this.dom.layoutDropdownButton.addEventListener('click', this.handleLayoutDropdownButtonClicked);

    this.dom.layoutDropdownOptions.forEach((dropdownOption) => {
      dropdownOption.addEventListener('click', this.handleLayoutDropdownOptionClicked);
    });
  
    document.addEventListener('click', this.handleDropdownOutsideClick);
  }

  private destroyDropdowns() {
    this.dom.zoomDropdownButton.removeEventListener('click', this.handleZoomDropdownButtonClicked);

    this.dom.zoomDropdownOptions.forEach((dropdownOption) => {
      dropdownOption.removeEventListener('click', this.handleZoomDropdownOptionClicked);
    });

    this.dom.layoutDropdownButton.removeEventListener('click', this.handleLayoutDropdownButtonClicked);

    this.dom.layoutDropdownOptions.forEach((dropdownOption) => {
      dropdownOption.removeEventListener('click', this.handleLayoutDropdownOptionClicked);
    });
  
    document.removeEventListener('click', this.handleDropdownOutsideClick);
  }

  private handleUploadFileButtonClicked() {
    this.dom.uploadFileInput.click();
  }

  private handleUploadFileInputChanged() {
    const file = this.dom.uploadFileInput.files[0];

    if (file.type !== 'application/pdf') return;

    this.callbacks.onUploadFile(file);

    this.dom.uploadFileInput.value = null;
  }

  private handleDownloadFileButtonClicked() {
    this.callbacks.onDownloadFileButtonClicked?.();
  }

  private handlePageNumberInputChanged() {
    let pageNumber = Math.floor(this.dom.pageNumberInput.valueAsNumber);

    if (isNaN(pageNumber) || pageNumber < 1) pageNumber = 1;
    if (pageNumber > this.state.pageCount) pageNumber = this.state.pageCount;

    this.state.pageNumber = pageNumber;
    this.dom.pageNumberInput.value = pageNumber.toString();
    this.callbacks.onPageNumberChanged?.(this.state.pageNumber);

    this.refreshPaginationButtons();
  }

  private handlePrevPageButtonClicked() {
    if (this.state.pageNumber <= 1) return;
    this.state.pageNumber--;
    this.callbacks.onPageNumberChanged?.(this.state.pageNumber);
  }

  private handleNextPageButtonClicked() {
    if (this.state.pageNumber >= this.state.pageCount) return;
    this.state.pageNumber++;
    this.callbacks.onPageNumberChanged?.(this.state.pageNumber);
  }

  private handleToggleInformationPaneButtonClicked() {
    this.state.informationPaneOpened = !this.state.informationPaneOpened;
    this.dom.toggleInformationPaneButton.classList.toggle('active', this.state.informationPaneOpened);
    this.callbacks.onToggleInformationPaneButtonClicked?.(this.state.informationPaneOpened);
  }

  private handleToggleSearchToolbarButtonClicked() {
    this.state.searchToolbarOpened = !this.state.searchToolbarOpened;
    this.state.zoomToolbarOpened = false;
    this.state.layoutToolbarOpened = false;
    this.callbacks.onToggleSearchClicked(this.state.searchToolbarOpened);
    this.dom.searchInput.value = '';
    this.refreshSecondaryToolbars();
  }
  
  private handleToggleZoomToolbarButtonClicked() {
    this.state.searchToolbarOpened = false;
    this.state.zoomToolbarOpened = !this.state.zoomToolbarOpened;
    this.state.layoutToolbarOpened = false;
    this.refreshSecondaryToolbars();
  }
  
  private handleToggleLayoutToolbarButtonClicked() {
    this.state.searchToolbarOpened = false;
    this.state.zoomToolbarOpened = false;
    this.state.layoutToolbarOpened = !this.state.layoutToolbarOpened;
    this.refreshSecondaryToolbars();
  }

  private handleSearchInputInput() {
    this.callbacks.onSearchParamsChanged?.(
      this.dom.searchInput.value,
      { 
        startPage: 1, 
        isCaseSensitive: false,
        isWrappingEnabled: false,
        isRegex: false,
      },
    );
  }

  private handleSearchInputKeypress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.callbacks.onNextSearchButtonClicked();
    }
  }

  private handlePrevSearchMatchClicked() {
    this.callbacks.onPrevSearchButtonClicked?.();
  }

  private handleNextSearchMatchClicked() {
    this.callbacks.onNextSearchButtonClicked?.();
  }

  private handleZoomInButtonClicked() {
    let zoomIndex = 0;
    while (this.state.zoomDropdownValue >= this.ZOOM_OPTIONS[zoomIndex]) zoomIndex++;
    this.state.zoomDropdownValue = this.ZOOM_OPTIONS[zoomIndex];

    this.callbacks.onZoomChanged?.(this.state.zoomDropdownValue);

    const dropdownValue = this.dom.zoomDropdown.querySelector('.dropdown-value') as HTMLSpanElement;
    dropdownValue.innerText = `${this.state.zoomDropdownValue}%`;

    this.refreshZoomButtons();
  }

  private handleZoomOutButtonClicked() {
    let zoomIndex = this.ZOOM_OPTIONS.length - 1;
    while (this.state.zoomDropdownValue <= this.ZOOM_OPTIONS[zoomIndex]) zoomIndex--;
    this.state.zoomDropdownValue = this.ZOOM_OPTIONS[zoomIndex];

    this.callbacks.onZoomChanged?.(this.state.zoomDropdownValue);

    const dropdownValue = this.dom.zoomDropdown.querySelector('.dropdown-value') as HTMLSpanElement;
    dropdownValue.innerText = `${this.state.zoomDropdownValue}%`;

    this.refreshZoomButtons();
  }

  private handleZoomDropdownButtonClicked() {
    this.state.zoomDropdownOpened = !this.state.zoomDropdownOpened;
    this.refreshDropdowns();
  }

  private handleZoomDropdownOptionClicked(event: PointerEvent) {
    const dropdownOption = event.target as HTMLDivElement;
    this.state.zoomDropdownValue = Number(dropdownOption.dataset.value);
    this.state.zoomDropdownOpened = !this.state.zoomDropdownOpened;

    this.callbacks.onZoomChanged?.(this.state.zoomDropdownValue);

    const dropdownValue = this.dom.zoomDropdown.querySelector('.dropdown-value') as HTMLSpanElement;
    dropdownValue.innerText = dropdownOption.innerText;

    this.refreshZoomButtons();
    this.refreshDropdowns();
  }

  private handleToggleFitButtonClicked() {
    switch (this.state.fitMode) {
      case PdfFitMode.NONE: this.state.fitMode = PdfFitMode.FIT_PAGE; break;
      case PdfFitMode.FIT_WIDTH: this.state.fitMode = PdfFitMode.NONE; break;
      case PdfFitMode.FIT_PAGE: this.state.fitMode = PdfFitMode.FIT_WIDTH; break;
    }
    this.callbacks.onFitModeChanged?.(this.state.fitMode);
  }

  private handleRotateViewerButtonClicked() {
    this.callbacks.onRotateViewerButtonClicked?.();
  }

  private handleLayoutDropdownButtonClicked() {
    this.state.layoutDropdownOpened = !this.state.layoutDropdownOpened;
    this.refreshDropdowns();
  }

  private handleLayoutDropdownOptionClicked(event: PointerEvent) {
    const dropdownOption = event.target as HTMLDivElement;
    this.state.layoutDropdownValue = Number(dropdownOption.dataset.value) as PdfPageLayoutMode;
    this.state.layoutDropdownOpened = !this.state.layoutDropdownOpened;

    this.callbacks.onLayoutModeChanged?.(this.state.layoutDropdownValue);

    const dropdownValue = this.dom.layoutDropdown.querySelector('.dropdown-value') as HTMLSpanElement;
    dropdownValue.innerText = dropdownOption.innerText;

    this.refreshDropdowns();
  }

  private handleDropdownOutsideClick(event: MouseEvent) {
    if (this.state.zoomDropdownOpened && !this.dom.zoomDropdown.contains(event.target as Node)) {
      this.state.zoomDropdownOpened = false;
      this.refreshDropdowns();
    }
    if (this.state.layoutDropdownOpened && !this.dom.layoutDropdown.contains(event.target as Node)) {
      this.state.layoutDropdownOpened = false;
      this.refreshDropdowns();
    }
  }

  private handleWindowResize() {
    this.refreshSecondaryToolbars();
  }

  private refreshZoomButtons() {
    let zoomIndex = 0;
    while (this.state.zoomDropdownValue > this.ZOOM_OPTIONS[zoomIndex]) zoomIndex++;
    this.dom.zoomInButton.disabled = zoomIndex >= this.ZOOM_OPTIONS.length - 1;
    this.dom.zoomOutButton.disabled = zoomIndex <= 0;
  }

  private refreshPaginationButtons() {
    this.dom.prevPageButton.disabled = this.state.pageNumber <= 1;
    this.dom.nextPageButton.disabled = this.state.pageNumber >= this.state.pageCount;
  }
  
  private refreshFitModeIcon() {
    const icon = this.dom.toggleFitButton.querySelector('span[class^="material-icons"]') as HTMLSpanElement;
    switch (this.state.fitMode) {
      case PdfFitMode.NONE: icon.innerText = 'fullscreen'; break;
      case PdfFitMode.FIT_WIDTH: icon.innerText = 'fit_screen'; break;
      case PdfFitMode.FIT_PAGE: icon.innerText = 'zoom_out_map'; break;
    }
  }

  private refreshSecondaryToolbars() {
    this.dom.toggleSearchToolbarButton.classList.toggle('active', this.state.searchToolbarOpened);
    this.dom.toggleZoomToolbarButton.classList.toggle('active', this.state.zoomToolbarOpened);
    this.dom.toggleLayoutToolbarButton.classList.toggle('active', this.state.layoutToolbarOpened);

    this.dom.zoomToolbar.style.top = this.state.zoomToolbarOpened ? `${this.dom.zoomToolbar.parentElement.clientHeight}px` : '0px';
    this.dom.layoutToolbar.style.top = this.state.layoutToolbarOpened ? `${this.dom.layoutToolbar.parentElement.clientHeight}px` : '0px';
    this.dom.searchToolbar.style.top = this.state.searchToolbarOpened ? `${this.dom.searchToolbar.parentElement.clientHeight}px` : '0px';
  }
  
  private refreshDropdowns() {
    this.dom.zoomDropdownOptionsContainer.style.display = this.state.zoomDropdownOpened ? 'flex' : 'none';
    this.dom.layoutDropdownOptionsContainer.style.display = this.state.layoutDropdownOpened ? 'flex' : 'none';
  }
}