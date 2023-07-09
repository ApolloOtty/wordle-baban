import logo from './logo.svg';
import Main from "./pages/main.jsx"
import React from 'react';
import { BrowserRouter, Route, Routes, HashRouter } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <HashRouter basename="/">
          <Route path="/" element={<Main/>} />
        </HashRouter>
    </BrowserRouter>
  );
}

export default App;
