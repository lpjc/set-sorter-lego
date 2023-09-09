import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [legoSets, setLegoSets] = useState([]);
  const apiKey = 'e00fe84219678222906b99be611d12c1';
  const [theme, setTheme] = useState(171);
  const [filteredSets, setFilteredSets] = useState([]);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [guess, setGuess] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [offBy, setOffBy] = useState(null); // Track how many parts the guess is off by

  useEffect(() => {
    const apiUrl = 'https://rebrickable.com/api/v3/lego/sets/?page_size=1000';
    const headers = {
      Accept: 'application/json',
      Authorization: `key ${apiKey}`,
    };

    axios
      .get(apiUrl, { headers })
      .then((response) => {
        setLegoSets(response.data.results);
      })
      .catch((error) => {
        console.error('Error fetching LEGO set information:', error);
      });
  }, []);

  useEffect(() => {
    const filteredSets = legoSets.filter((legoSet) => legoSet.theme_id === theme);
    setFilteredSets(filteredSets);
    setCurrentSetIndex(0);
    setGuess('');
    setIsCorrect(false);
    setOffBy(null); // Reset offBy when theme changes
  }, [theme, legoSets]);

  const handleGuessSubmit = (e) => {
    e.preventDefault();

    const currentSet = filteredSets[currentSetIndex];
    const userGuess = parseInt(guess);

    if (currentSet && userGuess === currentSet.num_parts) {
      setIsCorrect(true);
      setOffBy(null); // Reset offBy when the guess is correct
    } else {
      setIsCorrect(false);
      setOffBy(currentSet.num_parts - userGuess);
    }
  };

  const handleNextSet = () => {
    setCurrentSetIndex((prevIndex) => prevIndex + 1);
    setGuess('');
    setIsCorrect(false);
    setOffBy(null); // Reset offBy when moving to the next set
  };

  return (
    <div className="container">
      <h1>LEGO Set Guessing Game</h1>
      <div>
        <label>Select Theme:</label>
        <select onChange={(e) => setTheme(parseInt(e.target.value))} value={theme}>
          <option value={171}>Star Wars</option>
          <option value={246}>Harry Potter</option>
          {/* Add more theme options as needed */}
        </select>
      </div>
      {filteredSets.length > 0 && currentSetIndex < filteredSets.length && (
        <div className="lego-set-card">
          <h2>{filteredSets[currentSetIndex].name}</h2>
          <img src={filteredSets[currentSetIndex].set_img_url} alt={`Image of LEGO Set`} className="lego-set-image" />
          <form onSubmit={handleGuessSubmit}>
            <label>Enter your guess:</label>
            <input
              type=""
              value={guess}
              onChange={(e) => setGuess(e.target.value)}
              disabled={isCorrect}
            />
            <button type="submit" disabled={isCorrect}>
              Submit Guess
            </button>
          </form>
          {isCorrect ? (
            <p className="correct">Correct! The set has {filteredSets[currentSetIndex].num_parts} parts.</p>
          ) : (
            <p className="off-by">
              {offBy !== null && offBy !== 0
                ? `You are off by ${Math.abs(offBy)} part(s).`
                : offBy === 0
                ? 'You got it exactly right!'
                : 'Make a guess!'}
            </p>
          )}
          <button onClick={handleNextSet}>Next Set</button>
        </div>
      )}
    </div>
  );
}

export default App;
