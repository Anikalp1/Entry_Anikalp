import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Navbar from './Navbar';
import './index.css';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <Navbar />
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
