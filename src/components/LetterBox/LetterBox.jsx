import React from 'react';

import './LetterBox.css';

export const LetterBox = ({ letter, hidden }) => {
  return (
    <div className="LetterBox">
      <p>{hidden ? ' ' : letter}</p>
    </div>
  );
};
