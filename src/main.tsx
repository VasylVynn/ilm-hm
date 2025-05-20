import * as Sentry from "@sentry/react";
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './stylesheet/index.css'
import './stylesheet/reset.css'


Sentry.init({
  dsn: "https://fac4960dfdb0f0561867f77c4ad36ba0@o4508239374581760.ingest.de.sentry.io/4508239376678992",
  integrations: [],
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
