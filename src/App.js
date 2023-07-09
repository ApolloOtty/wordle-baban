import logo from './logo.svg';
import Main from "./pages/main.jsx"
import React from 'react';
import { BrowserRouter, Route, Routes, HashRouter } from 'react-router-dom';
import './App.css';

function App() {
  return (
      <HashRouter basename="/">
        <Routes>
          <Route path="/" element={<Main/>} />
        </Routes>
        </HashRouter>
  );
}

export default App;
