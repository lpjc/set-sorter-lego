import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';


function App() {
  const [legoSets, setLegoSets] = useState([]);
  const apiKey = 'e00fe84219678222906b99be611d12c1';
  const [theme, setTheme] = useState(171);
  const [filteredSets, setFilteredSets] = useState([]);
  const [currentSetIndex, setCurrentSetIndex] = useState(null); // Initialize as null
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [guessTimeline, setGuessTimeline] = useState([]); // Maintain a list of guesses and messages

  useEffect(() => {
    const apiUrl = 'https://rebrickable.com/api/v3/lego/sets/?page_size=4000';
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

    // Select a random set from filteredSets on load
    const randomIndex = Math.floor(Math.random() * filteredSets.length);
    setCurrentSetIndex(randomIndex);

    setGuess('');
    setFeedback('');
    setIsCorrect(false);
    setGuessTimeline([]); // Clear the guess timeline on theme change
  }, [theme, legoSets]);

  const handleGuessSubmit = (e) => {
    e.preventDefault();
    const currentSet = filteredSets[currentSetIndex];
    const userGuess = parseInt(guess);
    let newFeedback = '';

    if (userGuess === currentSet.num_parts) {
      setIsCorrect(true);
      newFeedback = 'Correct!';
    } else if (userGuess < currentSet.num_parts) {
      newFeedback = 'Higher';
      setIsCorrect(false);
    } else {
      newFeedback = 'Lower';
      setIsCorrect(false);
    }

    // Update the guess timeline with the new guess and feedback
    setGuessTimeline((prevTimeline) => [...prevTimeline, { guess: userGuess, feedback: newFeedback }]);

    setGuess(''); // Clear the input field
    setFeedback(newFeedback); // Display the new feedback
  };

  const handleNextSet = () => {
    if (filteredSets.length > 0) {
      const shuffleDuration = 800; // Duration of the shuffle in milliseconds
      const frameDelay = 40; // Delay between frames in milliseconds
      let startTime = null;
      let currentIndex = currentSetIndex;

      const animateShuffle = (timestamp) => {
        if (!startTime) {
          startTime = timestamp;
        }

        const elapsedTime = timestamp - startTime;

        if (elapsedTime < shuffleDuration) {
          // Shuffle images
          let newIndex;
          do {
            newIndex = Math.floor(Math.random() * filteredSets.length);
          } while (newIndex === currentIndex);

          currentIndex = newIndex; // Update currentIndex here

          setCurrentSetIndex(newIndex);

          // Request the next animation frame with the specified delay
          setTimeout(() => {
            requestAnimationFrame(animateShuffle);
          }, frameDelay);
        } else {
          // After the shuffle, set the final image
          setCurrentSetIndex(currentIndex);

          // Reset other values
          setGuess('');
          setFeedback('');
          setIsCorrect(false);
          setGuessTimeline([]); // Clear the guess timeline
        }
      };

      // Start the shuffle animation
      requestAnimationFrame(animateShuffle);
    }
  };

  return (
    <div className="container">
      {currentSetIndex !== null && filteredSets.length > 0 && (
        <div className="card-container">
           <div className="header">

              <h2>{filteredSets[currentSetIndex].name}</h2>
            </div>
          <div className="image-card">
            <img src={filteredSets[currentSetIndex].set_img_url} alt={`Image of LEGO Set`} />
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
                  disabled={isCorrect}
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
              {guessTimeline.map((item, index) => (
                <div key={index} className="guess-item">
                  <span className="guess-value">{item.guess}</span>
                  <span className={`feedback-value ${item.feedback === 'Correct!' ? 'correct' : 'off-by'}`}>
                    {item.feedback}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <button className="button" onClick={handleNextSet}>
            <i class="fa fa-random" aria-hidden="true"></i>
          </button>
        </div>
      )}
    </div>
  );
  
}

export default App;