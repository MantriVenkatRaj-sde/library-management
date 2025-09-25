import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GenresProvider } from './Contexts/GenreContext';
import { ChatProvider } from './context/ChatContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
// create one client for the entire app
const queryClient = new QueryClient();
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <GenresProvider>
        <ChatProvider>
          <App />
        </ChatProvider>
      </GenresProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
