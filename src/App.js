import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [legoSets, setLegoSets] = useState([]);
  const apiKey = 'e00fe84219678222906b99be611d12c1';
  const [themes, setThemes] = useState([171, 209, 18]);
  const [currentSetIndex, setCurrentSetIndex] = useState(null);
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [guessTimeline, setGuessTimeline] = useState([]);
  const [inputActive, setInputActive] = useState(true);
  const [remainingGuesses, setRemainingGuesses] = useState(3);
  const [targetParts, setTargetParts] = useState(0);
  const [playerGuesses, setPlayerGuesses] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    const apiUrl = 'https://rebrickable.com/api/v3/lego/sets/?page_size=4000';
    const headers = {
      Accept: 'application/json',
      Authorization: `key ${apiKey}`,
    };

    const themePromises = themes.map((themeId) =>
      axios.get(apiUrl, { headers, params: { theme_id: themeId } })
    );

    Promise.all(themePromises)
      .then((responses) => {
        const combinedSets = responses.reduce((acc, response) => {
          return acc.concat(response.data.results);
        }, []);

        setLegoSets(combinedSets);

        const randomIndex = Math.floor(Math.random() * combinedSets.length);
        setCurrentSetIndex(randomIndex);

        animateShuffle();
      })
      .catch((error) => {
        console.error('Error fetching LEGO set information:', error);
      });
  }, [themes]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const animateShuffle = () => {
    if (legoSets.length > 0) {
      const shuffleDuration = 800;
      const frameDelay = 40;
      let startTime = null;
      let currentIndex = currentSetIndex;

      const animateShuffleFrame = (timestamp) => {
        if (!startTime) {
          startTime = timestamp;
        }

        const elapsedTime = timestamp - startTime;

        if (elapsedTime < shuffleDuration) {
          let newIndex;
          do {
            newIndex = Math.floor(Math.random() * legoSets.length);
          } while (newIndex === currentIndex);

          currentIndex = newIndex;

          setCurrentSetIndex(newIndex);

          setTimeout(() => {
            requestAnimationFrame(animateShuffleFrame);
          }, frameDelay);
        } else {
          setCurrentSetIndex(currentIndex);
          setGuess('');
          setFeedback('');
          setIsCorrect(false);
          setGuessTimeline([]);
          setInputActive(true);

          if (inputRef.current) {
            inputRef.current.focus();
          }

          setTargetParts(legoSets[currentIndex].num_parts);
          setRemainingGuesses(3);
          setPlayerGuesses([]);

          console.log('Currently shown set:', legoSets[currentIndex]);
        }
      };

      requestAnimationFrame(animateShuffleFrame);
    }
  };

  const handleGuessSubmit = (e) => {
    e.preventDefault();
    const userGuess = parseInt(guess);
    let newFeedback = '';

    if (userGuess === targetParts) {
      setIsCorrect(true);
      newFeedback = 'Correct!';
    } else if (userGuess < targetParts) {
      newFeedback = 'Higher';
      setIsCorrect(false);
    } else {
      newFeedback = 'Lower';
      setIsCorrect(false);
    }

    setGuessTimeline((prevTimeline) => [...prevTimeline, { guess: userGuess, feedback: newFeedback }]);
    setGuess('');
    setFeedback(newFeedback);

    const updatedGuesses = [...playerGuesses, { guess: userGuess, feedback: newFeedback }];
    setPlayerGuesses(updatedGuesses);

    setRemainingGuesses((prevRemaining) => prevRemaining - 1);

    if (remainingGuesses === 1) {
      const bestGuess = updatedGuesses.reduce(
        (min, guess) =>
          Math.abs(guess.guess - targetParts) < min
            ? Math.abs(guess.guess - targetParts)
            : min,
        Math.abs(updatedGuesses[0].guess - targetParts)
      );

      setFeedback(`You were ${bestGuess} parts away from the correct answer.`);
      setInputActive(false);
    }
  };

  const handleNextSet = () => {
    setInputActive(true);
    animateShuffle();
  };

  return (
    <div className="container">
      {currentSetIndex !== null && legoSets.length > 0 && (
        <div className="card-container">
          <div className="header">
            <h2>{legoSets[currentSetIndex].name}</h2>
          </div>
          <div className="image-card">
            <img src={legoSets[currentSetIndex].set_img_url} alt={`Image of LEGO Set`} />
          </div>
          <div className="content-container">
            <div className="input-card">
              <form onSubmit={handleGuessSubmit}>
                <input
                  className='input-field'
                  type="number"
                  value={guess}
                  placeholder="How many parts?"
                  onChange={(e) => setGuess(e.target.value)}
                  autoFocus
                  disabled={!inputActive}
                />
              </form>
              <div className="feedback">
                {isCorrect ? (
                  <p className="correct">{feedback}</p>
                ) : (
                  <p className="off-by">{feedback}</p>
                )}
              </div>
            </div>
          </div>
          <div className="guess-timeline">
            <div className="timeline-content">
              {playerGuesses.map((item, index) => (
                <div key={index} className="guess-item">
                  <span className="guess-value">{item.guess}</span>
                  <span className={`feedback-value ${item.feedback === 'Higher' ? 'higher' : 'lower'}`}>
      {item.feedback}
    </span>
                </div>
              ))}
            </div>
          </div>
          <button className="button" onClick={handleNextSet}>
            <i className="fa fa-random" aria-hidden="true"></i>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
