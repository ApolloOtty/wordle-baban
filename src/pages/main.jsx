import React, { useState,useEffect, useRef } from 'react';
import Keyboard from '../components/keyboard';
import '../components/keyboard.css';

const App = () => {

  const [word, setWord] = useState('COAIE');


  const [selectedLetters, setSelectedLetters] = useState([]);

  const firstRow = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const secondRow = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const thirdRow = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];


  const [firstRowColor, setFirstRowColor] = useState(Array(firstRow.length).fill(''));
  const [secondRowColor, setSecondRowColor] = useState(Array(secondRow.length).fill(''));
  const [thirdRowColor, setThirdRowColor] = useState(Array(thirdRow.length).fill(''));


  const WORD_LENGTH = 5;

  const [modifiedRowIndex, setModifiedRowIndex] = useState(-1);
  const [animatingSquareIndex, setAnimatingSquareIndex] = useState(-1);

  const [errorWordNotExist, setErrorWordNotExist]=useState(false);
  useEffect(() => {
    let timeoutId;
    if (errorWordNotExist) {
      timeoutId = setTimeout(() => {
        setErrorWordNotExist(0);
      }, 2500);
    }

    return () => clearTimeout(timeoutId);
  }, [errorWordNotExist]);
  const [matrix, setMatrix] = useState([
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
    ['', '', '', '', ''],
  ]);

  const [wordToGuess, setWordToGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);

  const [showOverlay, setShowOverlay] = useState(false);

  const handleClose = () => {
    setShowOverlay(false);
  };

  const emojiRef = useRef(null);


  const [c, setC] = useState(0);

  const [colors, setColors] = useState([
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', ''],
  ['', '', '', '', '']]);


  const renderEmoji = (color) => {
    switch (color) {
      case 'correct':
        return '🟩';
      case 'exists':
        return '🟨';
      case 'grey':
        return '⬛';
      default:
        return '';
    }
  };

  const handleCopy = () => {
    const emojis = colors.map((row) => row.map((color) => renderEmoji(color)).join('')).join('\n');
    if (emojis) {
      navigator.clipboard.writeText("Wordle Baban" + '\n' + emojis);
    }
  };

  const [keyboardButtonPressed, setKeyboardButtonPressed] = useState(false);
  const [zoomedRowIndex, setZoomedRowIndex] = useState(null);
  const [zoomedColumnIndex, setZoomedColumnIndex] = useState(null);
  const [currentRow, setCurrentRow] = useState(0);
  const [currentColumn, setCurrentColumn] = useState(0);
  const handleLetterClick = (letter) => {
    if(gameOver == false){
    if (letter === 'Delete' && c>0) {
       setC(c-1);
      const updatedMatrix = [...matrix];
      updatedMatrix[currentRow][currentColumn - 1] = '';
      setMatrix(updatedMatrix);
      setWordToGuess((prevWord) => prevWord.slice(0, -1));
      if (currentColumn > 0) setCurrentColumn(currentColumn - 1);
    } else if (letter === 'Enter' && c === 5) {
      console.log(wordToGuess); // Log the word in the console
      if(word === wordToGuess.toUpperCase()){
        console.log("cucu")
      }
      // Check if the word exists in the text file
      const wordToCheck = wordToGuess.toLowerCase();
  fetch('/cuvinte.txt')
    .then((response) => {
      if (!response.ok) {
        throw new Error('Failed to fetch word list.');
      }
      return response.text();
    })
    .then((data) => {
      const found = data.includes(wordToCheck.trim());
      if (found) {
        setC(0);
        setCurrentColumn(0);
        setCurrentRow(currentRow + 1);
        const updatedMatrix = [...matrix];
        setMatrix(updatedMatrix);
        checkWord();
        console.log(wordToGuess); // Log the word in the console
        setWordToGuess(''); // Reset the word variable
        setErrorWordNotExist(false); // Reset error state since the word exists
      } else {
        setErrorWordNotExist(true); // Set error state if the word doesn't exist
        setWordToGuess('');
      }
    })
    .catch((error) => {
      console.error(error);
      setErrorWordNotExist(true); // Set error state if there's a fetch error
    });
} else if(letter !="Enter" && c!=5 && letter!="Delete"){
      if (currentColumn < 5) {
        setC(c+1);
        setWordToGuess((prevWord) => prevWord + letter); // Append the letter to the word
        const updatedMatrix = [...matrix];
        updatedMatrix[currentRow][currentColumn] = letter;
        setMatrix(updatedMatrix);
        setCurrentColumn(currentColumn + 1);
        console.log(c);
        setZoomedRowIndex(currentRow); // Set the zoomedRowIndex to the current row
        setZoomedColumnIndex(currentColumn);
      }else {
          setZoomedRowIndex(null); // Reset the zoomedRowIndex if it's not needed
          setZoomedColumnIndex(null); // Reset the zoomedColumnIndex if it's not needed
      }
    
  }}
  };


  function computeColors(targetWord, guess) {
    const colors = Array(WORD_LENGTH).fill(null);
    const indicesOfIncorrectLettersInGuess = [];
    const targetLetters = {};
  
    for (let i = 0; i < WORD_LENGTH; ++i) {
      let targetLetter = targetWord[i];
  
      if (targetLetter in targetLetters) {
        targetLetters[targetLetter]++;
      } else {
        targetLetters[targetLetter] = 1;
      }
  
      if (guess[i] === targetLetter) {
        colors[i] = "correct";
        targetLetters[targetLetter]--;
      } else {
        indicesOfIncorrectLettersInGuess.push(i);
      }
    }
  
    const updatedFirstRowColor = [...firstRowColor];
    const updatedSecondRowColor = [...secondRowColor];
    const updatedThirdRowColor = [...thirdRowColor];
  
    for (const i of indicesOfIncorrectLettersInGuess) {
      let guessLetter = guess[i];
  
      if (guessLetter in targetLetters && targetLetters[guessLetter] > 0) {
        colors[i] = "exists";
        targetLetters[guessLetter]--;
      } else if (colors[i] !== "correct") {
        colors[i] = "grey";
      }
    }
  
    for (let j = 0; j < firstRow.length; j++) {
      for (let k = 0; k < firstRow.length; k++) {
        if (firstRow[k] === guess[j] && updatedFirstRowColor[k] !== "correct") {
          updatedFirstRowColor[k] = colors[j];
        }
      }
    }
  
    for (let j = 0; j < secondRow.length; j++) {
      for (let k = 0; k < secondRow.length; k++) {
        if (secondRow[k] === guess[j] && updatedSecondRowColor[k] !== "correct") {
          updatedSecondRowColor[k] = colors[j];
        }
      }
    }
  
    for (let j = 0; j < thirdRow.length; j++) {
      for (let k = 0; k < thirdRow.length; k++) {
        if (thirdRow[k] === guess[j] && updatedThirdRowColor[k] !== "correct") {
          updatedThirdRowColor[k] = colors[j];
        }
      }
    }
  
    setFirstRowColor(updatedFirstRowColor);
    setSecondRowColor(updatedSecondRowColor);
    setThirdRowColor(updatedThirdRowColor);
  
    return colors;
  }
  
  
  const checkWord = () => {
    const guessedWord = matrix[currentRow].join('');
    const updatedMatrix = [...matrix];
    const colorsCopy = [...colors];
  
    const computedColors = computeColors(word, guessedWord);
  
    const updateColors = (index) => {
      if (index >= updatedMatrix[currentRow].length) return;
  
      updatedMatrix[currentRow][index] = guessedWord[index];
      if (!colorsCopy[currentRow]) {
        colorsCopy[currentRow] = [];
      }
      colorsCopy[currentRow][index] = computedColors[index];
  
      setMatrix(updatedMatrix);
      setColors(colorsCopy);
  
      setTimeout(() => {
        updateColors(index + 1);
      }, 200);
    };

    updateColors(0);
    setModifiedRowIndex(currentRow);
    setAnimatingSquareIndex(0);
    if(word === wordToGuess.toUpperCase()){
      setGameOver(true);
      const delay = 1700; // Delay in milliseconds (e.g., 2000ms = 2 seconds)

    const timer = setTimeout(() => {
      setShowOverlay(true);
    }, delay);
      return // Set gameOver to true if the word is guessed correctly
    }
  };
  
  
  useEffect(() => {
    if (animatingSquareIndex !== -1) {
      const timer = setTimeout(() => {
        setAnimatingSquareIndex((prevIndex) => prevIndex + 1);
      }, 200); // Adjust the delay duration (in milliseconds) as needed
  
      return () => clearTimeout(timer);
    }
  }, [animatingSquareIndex]);
  

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setCurrentRow((prevRow) => prevRow + 1);
      setCurrentColumn(0);
      checkWord();
    }
  };

  const [animationIndex, setAnimationIndex] = useState(0);

  useEffect(() => {
    if (currentRow > 0) {
      const timeout = setTimeout(() => {
        setAnimationIndex(animationIndex + 1);
      }, 200);
  
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [currentRow, animationIndex]);

  return (
    <div>
    <div className={`error-message ${errorWordNotExist ? 'show' : ''}`}>
      Nu exista cuvantu' ala ba tumefiatule =)))))))))
        </div>

      <div className={`win ${gameOver ? 'show' : ''}`}>
       Noa
      </div>
      
      {showOverlay && (
        <div className={`overlay ${showOverlay ? 'show' : ''}`}>
          <button className="close-button" onClick={handleClose}>
            Close
          </button>
          <h2>Wordle baban</h2>
          {colors.map((row, rowIndex) => (
        <div key={rowIndex}>
          {row.map((color, columnIndex) => (
            <span key={columnIndex}>{renderEmoji(color)}</span>
          ))}
        </div>
      ))}
      <button className='buton_copy' onClick={handleCopy}>Copiaza draga copiaza sa trimiti pe grup (asta e un buton in caz ca nu ti-ai dat seama)</button>
      <textarea ref={emojiRef} style={{ position: 'absolute', top: -9999, left: -9999 }} />
        </div>
      )}
      <div className="content">
        {/* Your website content */}
      </div>

<div className="matrix-container">
  <div className="matrix">
    {matrix.map((row, rowIndex) => (
      <div key={rowIndex} className={`row ${rowIndex === currentRow ? 'current-row' : ''}`}>
        {row.map((letter, columnIndex) => (
          <div
            key={columnIndex}
            className={`square ${colors[rowIndex][columnIndex]} ${rowIndex === modifiedRowIndex && columnIndex <= animatingSquareIndex ? 'animate' : ''} ${zoomedRowIndex !== null && zoomedRowIndex === rowIndex && zoomedColumnIndex !== null && zoomedColumnIndex === columnIndex ? 'expand' : ''} ${matrix[rowIndex][columnIndex] ? 'has-letter' : ''}`}
            >
            <span>{letter}</span>
          </div>
        ))}
      </div>
    ))}
  </div>
</div>
<div>
      
    </div>
    <div className='keyboard-container'>
      <div id="keyboard" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Keyboard alphabet={firstRow} onClick={handleLetterClick} color={firstRowColor}/>
      </div>
      <div id="keyboard" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Keyboard alphabet={secondRow} onClick={handleLetterClick} color={secondRowColor}/>
      </div>

      <div id="keyboard" style={{ display: 'flex', flexDirection: '', alignItems: 'center', justifyContent: 'center' }}>
        <Keyboard alphabet={['Enter']} onClick={handleLetterClick} className=".keyboard-button.enter_delete" />
        <Keyboard alphabet={thirdRow} onClick={handleLetterClick} color={thirdRowColor}/>
        <Keyboard alphabet={['Delete']} onClick={handleLetterClick} />
      </div>
      <p>{selectedLetters.join('')}</p>
      </div>
    </div>
  );
};

export default App;
