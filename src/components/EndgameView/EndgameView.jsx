import React from 'react';

import './EndgameView.css';

/**
 * This is a simple component to end and reset the game.
 */
export const EndgameView = ({ playerDidWin, wordToGuess, resetEvent }) => {
  return (
    <div className="endgame-view-container">
      <h1>{playerDidWin ? 'Congratulations!' : 'So sorry!'}</h1>
      <p>the word was: {wordToGuess}.</p>
      <p>{playerDidWin ? 'You won!' : 'You lost!'}</p>
      <div>
        <button onClick={resetEvent}>Play again?</button>
      </div>
    </div>
  );
};
