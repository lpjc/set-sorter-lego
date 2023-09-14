import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [legoSets, setLegoSets] = useState([]);
  const apiKey = 'e00fe84219678222906b99be611d12c1';
  const [themes, setThemes] = useState([171,209,18,261]); // Replace with your desired theme IDs
  const [currentSetIndex, setCurrentSetIndex] = useState(null); // Initialize as null
  const [guess, setGuess] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isCorrect, setIsCorrect] = useState(false);
  const [guessTimeline, setGuessTimeline] = useState([]); // Maintain a list of guesses and messages
  const [inputActive, setInputActive] = useState(true); // Initially active input

  useEffect(() => {
    const apiUrl = 'https://rebrickable.com/api/v3/lego/sets/?page_size=4000';
    const headers = {
      Accept: 'application/json',
      Authorization: `key ${apiKey}`,
    };

    // Create an array of promises to fetch sets for each theme ID
    const themePromises = themes.map((themeId) =>
      axios.get(apiUrl, { headers, params: { theme_id: themeId } })
    );

    Promise.all(themePromises)
      .then((responses) => {
        // Combine the results from all theme IDs into a single array
        const combinedSets = responses.reduce((acc, response) => {
          return acc.concat(response.data.results);
        }, []);

        setLegoSets(combinedSets);

        // Select a random set from combinedSets on theme change
        const randomIndex = Math.floor(Math.random() * combinedSets.length);
        setCurrentSetIndex(randomIndex);

        // Trigger the shuffle animation here
        animateShuffle();
      })
      .catch((error) => {
        console.error('Error fetching LEGO set information:', error);
      });
  }, [themes]);

  const animateShuffle = () => {
    if (legoSets.length > 0) {
      const shuffleDuration = 800; // Duration of the shuffle in milliseconds
      const frameDelay = 40; // Delay between frames in milliseconds
      let startTime = null;
      let currentIndex = currentSetIndex;
  
      const animateShuffleFrame = (timestamp) => {
        if (!startTime) {
          startTime = timestamp;
        }
  
        const elapsedTime = timestamp - startTime;
  
        if (elapsedTime < shuffleDuration) {
          // Shuffle images
          let newIndex;
          do {
            newIndex = Math.floor(Math.random() * legoSets.length);
          } while (newIndex === currentIndex);
  
          currentIndex = newIndex; // Update currentIndex here
  
          setCurrentSetIndex(newIndex);
  
          // Request the next animation frame with the specified delay
          setTimeout(() => {
            requestAnimationFrame(animateShuffleFrame);
          }, frameDelay);
        } else {
          // After the shuffle, set the final image
          setCurrentSetIndex(currentIndex);
  
          // Reset other values
          setGuess('');
          setFeedback('');
          setIsCorrect(false);
          setGuessTimeline([]); // Clear the guess timeline
          setInputActive(true); // Enable the input field after shuffle
  
          // Log the currently shown set object after shuffle animation
          console.log('Currently shown set:', legoSets[currentIndex]);
        }
      };
  
      // Start the shuffle animation
      requestAnimationFrame(animateShuffleFrame);
    }
  };
  

  const handleGuessSubmit = (e) => {
    e.preventDefault();
    const currentSet = legoSets[currentSetIndex];
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
    console.log('Currently shown set:', currentSet);

    // Update the guess timeline with the new guess and feedback
    setGuessTimeline((prevTimeline) => [...prevTimeline, { guess: userGuess, feedback: newFeedback }]);

    setGuess(''); // Clear the input field
    setFeedback(newFeedback); // Display the new feedback
    setInputActive(false); // Disable the input field after submitting a guess
  };

  const handleNextSet = () => {
    // Enable the input field for the next set
    setInputActive(true);
    // Trigger the shuffle animation for the next set
    animateShuffle();
    
    // Log the currently shown set object after shuffle animation

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
                  disabled={!inputActive}
                  autoFocus
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
            <i className="fa fa-random" aria-hidden="true"></i>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
