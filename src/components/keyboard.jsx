import React, { useState, useEffect } from 'react';
import './keyboard.css';

const LightModeButtons = ({ alphabet, onClick, color }) => {
  return (
    <div>
      {alphabet.map((letter, index) => (
        <button
          key={index}
          className={`keyboard-button ${
            color && color[index] === 'correct' ? 'green' :
            color && color[index] === 'exists' ? 'yellow' :
            color && color[index] === 'grey' ? 'grey' : ''
          } ${letter === 'Enter' || letter === 'Delete' ? 'enter_delete' : ''}`}
          onClick={() => onClick(letter)}
        >
          {letter}
        </button>
      ))}
    </div>
  );
};

const DarkModeButtons = ({ alphabet, onClick, color }) => {
  return (
    <div>
      {alphabet.map((letter, index) => (
        <button
        key={index}
        className={`keyboard-button dark ${
          color && color[index] === 'correct' ? 'green' :
          color && color[index] === 'exists' ? 'yellow' :
          color && color[index] === 'grey' ? 'grey-dark' : ''
        } ${letter === 'Enter' || letter === 'Delete' ? 'enter_delete' : ''}`}
        onClick={() => onClick(letter)}
      >
        {letter}
      </button>
      
      ))}
    </div>
  );
};

const Keyboard = ({ alphabet, onClick, color, lightdarkmode }) => {
  const [currentMode, setCurrentMode] = useState(lightdarkmode ? 'dark' : 'light');

  useEffect(() => {
    setCurrentMode(lightdarkmode ? 'dark' : 'light');
  }, [lightdarkmode]);

  return (
    <div>
      {currentMode === 'dark' ? (
        <DarkModeButtons alphabet={alphabet} onClick={onClick} color={color} />
      ) : (
        <LightModeButtons alphabet={alphabet} onClick={onClick} color={color} />
      )}
    </div>
  );
};

export default Keyboard;
