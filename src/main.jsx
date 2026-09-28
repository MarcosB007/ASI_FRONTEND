import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import '@fontsource-variable/inter'
import '@fontsource-variable/plus-jakarta-sans'
import './styles/base.css'
import './styles/layout.css'
import './styles/home.css'
import './styles/modulos.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
