import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router for routing
import reportWebVitals from './reportWebVitals';

// Wrap the app in Router for routing functionality
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// Optional: Report web vitals for performance tracking
reportWebVitals();
