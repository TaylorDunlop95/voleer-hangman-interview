import React, { Component } from 'react';
import axios from 'axios';

import { WORD_API_KEY } from '../../api-keys';

import { Hangman } from '../Hangman';
import { WordRow } from '../WordRow';

class HangmanApp extends Component {
  constructor(props) {
    super(props);
    this.state = { incorrectGuessCount: 0, guessWord: 'voleer', lettersGuessed: ['e'] };
  }

  handleInc = () => {
    let newCount = this.state.incorrectGuessCount + 1;

    if (newCount > 10) {
      return;
    } else {
      this.setState({ incorrectGuessCount: newCount });
    }
  };

  handleDec = () => {
    let newCount = this.state.incorrectGuessCount - 1;
    if (newCount < 0) {
      return;
    } else {
      this.setState({ incorrectGuessCount: newCount });
    }
  };

  getWord = async () => {
    await axios({
      method: 'GET',
      url: 'https://wordsapiv1.p.rapidapi.com/words/',
      headers: {
        'content-type': 'application/octet-stream',
        'x-rapidapi-host': 'wordsapiv1.p.rapidapi.com',
        'x-rapidapi-key': WORD_API_KEY,
      },
      params: {
        random: 'true',
      },
    })
      .then(response => {
        let wordToGuess = response.data.word;
        console.log(wordToGuess);
        if (!/['-/ ]/.test(wordToGuess)) {
          console.log(response);
          this.setState({ guessWord: wordToGuess, incorrectGuessCount: 0 });
        } else {
          this.getWord();
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    return (
      <div>
        <Hangman incorrectGuessCount={this.state.incorrectGuessCount}></Hangman>
        <p>{this.state.incorrectGuessCount}/10</p>
        <WordRow
          wordToGuess={this.state.guessWord}
          lettersGuessed={this.state.lettersGuessed}
        ></WordRow>
        <button onClick={() => this.handleInc()}>Increment</button>
        <button onClick={() => this.handleDec()}>Decrement</button>
        <button onClick={() => this.getWord()}>New Word</button>
      </div>
    );
  }
}

export default HangmanApp;
