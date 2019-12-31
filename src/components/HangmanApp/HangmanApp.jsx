import React, { Component } from 'react';
import ReactLoading from 'react-loading';
import axios from 'axios';

import { WORD_API_KEY } from '../../api-keys';

import { Hangman } from '../Hangman';
import { WordRow } from '../WordRow';
import { StatBox } from '../StatBox';
import { EndgameView } from '../EndgameView';
import './HangmanApp.css';

class HangmanApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      incorrectGuessCount: 0,
      wordToGuess: 'voleer',
      wordToGuessKey: ['v', 'o', 'l', 'e', 'r'],
      lettersGuessed: [],
      lettersGuessedCorrect: [],
      gameState: '',
      loading: false,
    };

    this.handleGuess = this.handleGuess.bind(this);
  }

  /**
   * For incrementing the incorrect guess counter.
   */
  handleInc = () => {
    let newCount = this.state.incorrectGuessCount + 1;

    if (newCount <= 10) {
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
   * Whenever the player guesses a letter it is compared against the other letters
   * the player guessed. If it is a new letter, then it is compared to the letters
   * in the actual word. If it matches a letter in the word, that letter is displayed.
   * Otherwise the incorrect guess counter increments and the hangman is updated.
   */
  handleGuess(event) {
    event.preventDefault();

    let letterGuessed = document.getElementById('user-input').value.toLowerCase();
    let guessedLetters = this.state.lettersGuessed;
    let wordToGuess = this.state.wordToGuess;

    if (!guessedLetters.includes(letterGuessed)) {
      if (wordToGuess.includes(letterGuessed)) {
        this.addGuessedLetter(letterGuessed);
        this.addCorrectGuessedLetter(letterGuessed);
      } else {
        this.addGuessedLetter(letterGuessed);
        this.handleInc();
      }
    }
    this.resetForm();
    this.checkGameover();
  }

  /**
   * For resetting the state of the game.
   */
  handleReset = () => {
    this.setState({
      incorrectGuessCount: 0,
      wordToGuess: 'voleer',
      wordToGuessKey: ['v', 'o', 'l', 'e', 'r'],
      lettersGuessed: [],
      lettersGuessedCorrect: [],
      gameState: '',
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

  addCorrectGuessedLetter = letterGuessed => {
    let correctLetters = this.state.lettersGuessedCorrect;
    correctLetters.push(letterGuessed);
    this.setState({ lettersGuessedCorrect: correctLetters });
  };

  createAnswerKey = wordToGuess => {
    let keyArr = String.prototype.concat(...new Set(wordToGuess)).split('');
    return keyArr;
  };

  /**
   * Utilizing the wordsAPI for the collection of a random word.
   * Will continue to GET on the /random endpoint until a word
   * with -just- standard letter characters is returned. No space, no apostrophe, no hyphen.
   *
   * i.e. "coke-plate" is invalid, "opacity" is valid.
   */
  getNewWord = async () => {
    this.setState({ gameState: '', loading: true });
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
        if (!/['-/ ]/.test(wordToGuess)) {
          this.handleReset();
          let answerKey = this.createAnswerKey(wordToGuess);
          this.setState({ wordToGuess: wordToGuess, wordToGuessKey: answerKey, loading: false });
        } else {
          this.getNewWord();
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  /**
   * The game is over when one of two conditions are met:
   *
   * 1. 10 incorrect guesses are made, then there is a loss.
   * 2. All the unique letters of the word are correctly guessed.
   *
   * The first point is pretty easy to check, provided that the counter
   * is updated when expected.
   *
   * The second point is much harder. By keeping track of the correct
   * letters guessed by the user, I am able to compare an array of those
   * correct guesses with an array of the unique characters making up the
   * word. If those arrays are sorted and they match, the player wins.
   */
  checkGameover = () => {
    let incorrectGuessCount = this.state.incorrectGuessCount;
    let keyArr = this.state.wordToGuessKey;
    let correctLetters = this.state.lettersGuessedCorrect;
    if (incorrectGuessCount + 1 === 10) {
      this.setState({ gameState: 'LOSS' });
    } else {
      if (
        keyArr.length === correctLetters.length &&
        keyArr.sort().every(function(value, index) {
          return value === correctLetters.sort()[index];
        })
      ) {
        this.setState({ gameState: 'WIN' });
      }
    }
  };

  render() {
    if (this.state.gameState === 'WIN') {
      return (
        <EndgameView
          playerDidWin={true}
          wordToGuess={this.state.wordToGuess}
          resetEvent={this.getNewWord}
        ></EndgameView>
      );
    }
    if (this.state.gameState === 'LOSS') {
      return (
        <EndgameView
          playerDidWin={false}
          wordToGuess={this.state.wordToGuess}
          resetEvent={this.getNewWord}
        ></EndgameView>
      );
    }
    if (this.state.loading) {
      return (
        <div className="loading-container">
          <ReactLoading type="spinningBubbles" color="#E7E7E7" height={'30%'} width={'30%'} />
        </div>
      );
    }
    return (
      <div>
        <Hangman incorrectGuessCount={this.state.incorrectGuessCount}></Hangman>
        <StatBox
          lettersGuessed={this.state.lettersGuessed}
          incorrectGuessCount={this.state.incorrectGuessCount}
        ></StatBox>

        <WordRow
          wordToGuess={this.state.wordToGuess}
          lettersGuessed={this.state.lettersGuessed}
        ></WordRow>
        <p>{this.state.showDefinition ? this.state.definition : ''}</p>
        <div>
          <form className="user-controls" onSubmit={this.handleGuess} id="letter-guess-form">
            <input className="user-input" type="text" id="user-input" maxLength="1" autoFocus />
            <div className="option-row">
              <button type="submit">Submit</button>
              <button type="button" onClick={() => this.getNewWord()}>
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
