import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import dccApi from './Shared/dcc/dccApi';
import reportWebVitals from './reportWebVitals';

const dccSerial = '/dev/tty.usbmodem2301'; // TODO: remove hard-coded port
const host = 'joshs-mac-mini.local'; // TODO: remove hard-coded host
const iface = { id: 'dcc-js-api', type: 'dcc-js-api' }; // TODO: remove hard-coded iface

await dccApi.connect(host, iface, dccSerial);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
