import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import Store from './Store';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HelmetProvider } from "react-helmet-async";
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={Store}>
      <HelmetProvider>
        {/* <App /> */}
        <GoogleReCaptchaProvider 
          reCaptchaKey="6Lcr3ecsAAAAAIhs3c165tW5uChK-Wz2gbHkijip"
          scriptProps={{
            async: true,
            defer: true,
            appendTo: 'head',
          }}
        >
          <App />
        </GoogleReCaptchaProvider>
      </HelmetProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
