import React from 'react';
import './keyboard.css';

const Keyboard = ({ alphabet, onClick, color }) => {

  return (
  <div>
    {alphabet.map((letter, index) => (
      <button
        key={index}
        className={`keyboard-button ${color && color[index] === 'correct' ? 'green' : color && color[index] === 'exists' ? 'yellow' : color && color[index] === 'grey' ? 'grey' : ''} ${letter === 'Enter' || letter === 'Delete' ? 'enter_delete' : ''}`}
        onClick={() => onClick(letter)}
      >
        {letter}
      </button>
    ))}
  </div>
);
};

export default Keyboard;
