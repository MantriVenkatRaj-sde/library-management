import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GenresProvider } from './Contexts/GenreContext';
import { UserContextProvider } from './context/UserContext';
import { ChatProvider } from './context/ChatContext';
import AuthProvider from './Authentication/AuthContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
const queryClient = new QueryClient();

root.render(
  <Router>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <UserContextProvider>
          <GenresProvider>
            <ChatProvider>
              <App />
            </ChatProvider>
          </GenresProvider>
        </UserContextProvider>
      </QueryClientProvider>
    </AuthProvider>
  </Router>
);

reportWebVitals();
