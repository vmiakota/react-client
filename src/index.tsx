import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {ThemeProvider} from "styled-components";
import {MeetingProvider} from "amazon-chime-sdk-component-library-react";
import {darkTheme} from 'amazon-chime-sdk-component-library-react'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
      <ThemeProvider theme={darkTheme}>
          {(
              // @ts-ignore
              <MeetingProvider>
                  <App/>
              </MeetingProvider>
          )}
      </ThemeProvider>
  </React.StrictMode>
);
