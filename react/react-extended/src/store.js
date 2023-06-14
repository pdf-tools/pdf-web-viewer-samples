export const initialState = {
  documents: [],
  openDocuments: [],
  selectedDocument: undefined,
}

export function reducer(state, action) {
  switch (action.type) {
    case 'setDocuments':
      return { ...state, documents: action.payload }

    case 'select': {
      const newState = { ...state }
      if (!newState.openDocuments.find((d) => d.url === action.payload)) {
        const doc = newState.documents.find((d) => d.url === action.payload)
        newState.openDocuments.push(doc)
      }
      newState.selectedDocument = action.payload
      return newState
    }

    case 'close': {
      const newState = { ...state }
      if (newState.openDocuments.length === 1) {
        newState.openDocuments = []
        newState.selectedDocument = undefined
      } else {
        const docIndex = newState.openDocuments.findIndex((d) => d.url === action.payload)
        newState.openDocuments.splice(docIndex, 1)

        if (newState.selectedDocument === action.payload) {
          let newSelectedIndex =
            docIndex + 1 >= newState.openDocuments.length ? docIndex - 1 : docIndex

          if (newSelectedIndex < 0) {
            newSelectedIndex = 0
          }

          newState.selectedDocument = newState.openDocuments[newSelectedIndex].url
        }
      }
      return newState
    }
    default:
      throw new Error()
  }
}
