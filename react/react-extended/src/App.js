import { useEffect, useReducer } from 'react'

import { reducer, initialState } from './store'
import DocumentList from './components/DocumentList'
import Tabs from './components/Tabs'
import Layout from './components/Layout'

export default () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    const loadDocIndex = async () => {
      const fetchRes = await fetch('./documents.json')
      const docIndex = await fetchRes.json()
      dispatch({
        type: 'setDocuments',
        payload: docIndex,
      })
      dispatch({ type: 'select', payload: docIndex[0].url })
    }
    loadDocIndex()
  }, [])

  function handleSelectDocument(documentId) {
    dispatch({ type: 'select', payload: documentId })
  }

  function handleCloseDocument(documentId) {
    dispatch({ type: 'close', payload: documentId })
  }
  return (
    <Layout>
      <DocumentList
        documents={state.documents}
        selectedDocument={state.selectedDocument}
        onSelect={handleSelectDocument}
      />
      <Tabs
        openDocuments={state.openDocuments}
        selectedDocument={state.selectedDocument}
        onSelect={handleSelectDocument}
        onClose={handleCloseDocument}
      />
    </Layout>
  )
}
