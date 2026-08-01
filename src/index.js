import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppChirho from './App';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppChirho />
  </React.StrictMode>
);
