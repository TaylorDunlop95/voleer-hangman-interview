import React from 'react';

import './LetterBox.css';

export const LetterBox = ({ letter, hidden }) => {
  return (
    <div className="letter-box">
      <p>{hidden ? ' ' : letter}</p>
    </div>
  );
};
