import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// React.StrictMode is disabled because PDF Web Viewer doesn't support Strict Mode's double-invocation behavior
ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
  <App />
  //   </React.StrictMode>
);
