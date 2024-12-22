import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import ShortestPathApp from './ShortestPathApp.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ShortestPathApp cols={61} rows={21} />
  </React.StrictMode>,
)
