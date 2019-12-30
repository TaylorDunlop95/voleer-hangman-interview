import React from 'react';

import './StatBox.css';

export const StatBox = ({ incorrectGuessCount, lettersGuessed }) => {
  return (
    <div className="row-container">
      <div className="row-item">
        <p className="label">incorrect guesses remaining</p>
        <p>{incorrectGuessCount} / 10</p>
      </div>
      <div className="row-item">
        <p className="label">letters guessed</p>
        <div className="letter-wrapper">
          {lettersGuessed.map(letter => {
            return <p>{letter}</p>;
          })}
        </div>
      </div>
    </div>
  );
};
