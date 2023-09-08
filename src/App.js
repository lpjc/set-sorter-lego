import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import Axios
import './App.css';

function ThemeOption({ value, name }) {
  return <option value={value}>{name}</option>;
}

function App() {
  const [legoSets, setLegoSets] = useState([]);
  const apiKey = 'e00fe84219678222906b99be611d12c1'; // Replace with your actual API key
  const [theme, setTheme] = useState(171); // Default theme ID (Star Wars)
  const [filteredSets, setFilteredSets] = useState([]); // Declare filteredSets state variable

  useEffect(() => {
    // Define the Rebrickable API endpoint
    const apiUrl = 'https://rebrickable.com/api/v3/lego/sets/?page_size=1000';

    // Define headers with your API key
    const headers = {
      Accept: 'application/json',
      Authorization: `key ${apiKey}`,
    };

    // Make a GET request to fetch LEGO set information
    axios.get(apiUrl, { headers })
      .then((response) => {
        // Update the state with the fetched data
        console.log('API response:', response);
        setLegoSets(response.data.results);

        // Log API connection status
        console.log('API connection successful');
      })
      .catch((error) => {
        console.error('Error fetching LEGO set information:', error);

        // Log API connection status
        console.log('API connection failed');
      });
  }, []); // The empty dependency array ensures this effect runs only once

  useEffect(() => {
    // Define a filtering function to include sets with more than 50 pieces and the selected theme
    const filterSets = (legoSet) => {
      return legoSet.num_parts > 50 && legoSet.theme_id === theme;
    };

    const filteredSets = legoSets.filter(filterSets);
    setFilteredSets(filteredSets); // Update filtered sets whenever the theme changes
  }, [theme, legoSets]);


  return (
    <div>
      <h1>LEGO Sets</h1>
      <div>
        <label>Select Theme:</label>
        <select onChange={(e) => setTheme(parseInt(e.target.value))} value={theme}>
          <ThemeOption value={171} name="Star Wars" />
          <ThemeOption value={246} name="Harry Potter" />
          {/* Add more theme options as needed */}
        </select>
      </div>
      <div className="lego-set-container">
        {filteredSets.map((legoSet) => (
          <div className="lego-set-card" key={legoSet.set_num}>
            <h2>{legoSet.name}</h2>
            <p>Set Number: {legoSet.set_num}</p>
            <p>Theme: {legoSet.theme_id}</p>
            <p>Year: {legoSet.year}</p>
            <p>Number of Parts: {legoSet.num_parts}</p>
            <img src={legoSet.set_img_url} alt={`Image of ${legoSet.name}`} className="lego-set-image" />
            {/* Add more details as needed */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
