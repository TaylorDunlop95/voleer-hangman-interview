import React from 'react';
import { LetterBox } from '../LetterBox';

import './WordRow.css';

export const WordRow = ({ wordToGuess, lettersGuessed }) => {
  let wordArr = wordToGuess.split('');
  return (
    <div className="row-container">
      {wordArr.map(char => {
        let hidden = lettersGuessed.includes(char) ? false : true;
        return <LetterBox letter={char} hidden={hidden}></LetterBox>;
      })}
    </div>
  );
};
