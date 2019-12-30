import React, { Component } from 'react';
import axios from 'axios';

import { WORD_API_KEY } from '../../api-keys';

import { Hangman } from '../Hangman';
import { WordRow } from '../WordRow';
import './HangmanApp.css';

class HangmanApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      incorrectGuessCount: 0,
      guessWord: 'voleer',
      lettersGuessed: [],
    };

    this.handleGuess = this.handleGuess.bind(this);
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

  handleGuess(event) {
    event.preventDefault();

    let letterGuessed = document.getElementById('user-input').value.toLowerCase();
    let guessedLetters = this.state.lettersGuessed;
    let wordToGuess = this.state.guessWord;

    if (!guessedLetters.includes(letterGuessed)) {
      if (wordToGuess.includes(letterGuessed)) {
        this.addGuessedLetter(letterGuessed);
      } else {
        this.addGuessedLetter(letterGuessed);
        this.handleInc();
      }
    }
    this.resetForm();
  }

  resetForm = () => {
    document.getElementById('letter-guess-form').reset();
  };

  addGuessedLetter = letterGuessed => {
    let guessedLetters = this.state.lettersGuessed;
    guessedLetters.push(letterGuessed);
    this.setState({ lettersGuessed: guessedLetters });
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
          this.setState({ guessWord: wordToGuess, incorrectGuessCount: 0, lettersGuessed: [] });
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
        <div>{this.state.lettersGuessed}</div>
        <WordRow
          wordToGuess={this.state.guessWord}
          lettersGuessed={this.state.lettersGuessed}
        ></WordRow>
        <div>
          <form className="user-controls" onSubmit={this.handleGuess} id="letter-guess-form">
            <input className="user-input" type="text" id="user-input" maxLength="1" autoFocus />
            <div className="option-row">
              <button type="submit">Submit</button>
              <button type="button" onClick={() => this.getWord()}>
                New Word
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default HangmanApp;
