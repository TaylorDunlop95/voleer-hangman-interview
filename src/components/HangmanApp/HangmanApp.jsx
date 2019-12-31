import React, { Component } from 'react';
import axios from 'axios';

import { WORD_API_KEY } from '../../api-keys';

import { Hangman } from '../Hangman';
import { WordRow } from '../WordRow';
import { StatBox } from '../StatBox';
import './HangmanApp.css';

class HangmanApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      incorrectGuessCount: 0,
      guessWord: 'voleer',
      guessWordKey: [],
      lettersGuessed: [],
      lettersGuessedCorrect: [],
    };

    this.handleGuess = this.handleGuess.bind(this);
  }

  /**
   * For incrementing the incorrect guess counter.
   */
  handleInc = () => {
    let newCount = this.state.incorrectGuessCount + 1;

    if (newCount > 10) {
      return;
    } else {
      this.setState({ incorrectGuessCount: newCount });
    }
  };

  /**
   * For decrementing the incorrect guess counter.
   */
  handleDec = () => {
    let newCount = this.state.incorrectGuessCount - 1;
    if (newCount < 0) {
      return;
    } else {
      this.setState({ incorrectGuessCount: newCount });
    }
  };

  /**
   * Run onSubmit
   */
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

  /**
   * For resetting the state of the game.
   */
  handleReset = () => {
    this.setState({
      incorrectGuessCount: 0,
      guessWord: 'voleer',
      guessWordKey: [],
      lettersGuessed: [],
      lettersGuessedCorrect: [],
    });
  };

  resetForm = () => {
    document.getElementById('letter-guess-form').reset();
  };

  addGuessedLetter = letterGuessed => {
    let guessedLetters = this.state.lettersGuessed;
    guessedLetters.push(letterGuessed);
    this.setState({ lettersGuessed: guessedLetters });
  };

  /**
   * Utilizing the wordsAPI for the collection of a random word.
   * Will continue to GET on the /random endpoint until a word
   * with -just- standard letter characters is returned. No space, no apostrophe, no hyphen.
   *
   * i.e. "coke-plate" is invalid, "opacity" is valid.
   */
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
          this.handleReset();
          this.setState({ guessWord: wordToGuess });
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
        <StatBox
          lettersGuessed={this.state.lettersGuessed}
          incorrectGuessCount={this.state.incorrectGuessCount}
        ></StatBox>

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
