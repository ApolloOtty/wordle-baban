import logo from './logo.svg';
import Main from "./pages/main.jsx"
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="https://apollootty.github.io/wordle-baban/" element={<Main/>} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
