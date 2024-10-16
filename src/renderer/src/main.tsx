import "./styles/index.css";

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import TranslationProvider from "./components/Translator";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <TranslationProvider>
      <App />
    </TranslationProvider>
  </React.StrictMode>
)
