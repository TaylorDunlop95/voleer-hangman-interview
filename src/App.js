import React from 'react';
import HangmanApp from './components/HangmanApp/HangmanApp';

import './App.css';

const App = () => {
  return (
    <div className="App">
      <div className="container">
        <h1 className="title">voleer hangman</h1>
        <HangmanApp></HangmanApp>
      </div>
    </div>
  );
};

export default App;
