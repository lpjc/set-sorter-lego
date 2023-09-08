import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import Axios
import './App.css';

function App() {
  const [legoSets, setLegoSets] = useState([]);
  const apiKey = 'e00fe84219678222906b99be611d12c1'; // Replace with your actual API key

  useEffect(() => {
    // Define the Rebrickable API endpoint
    const apiUrl = 'https://rebrickable.com/api/v3/lego/sets/?page=1&page_size15';

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

/* 
Possible data from API:
legoSet.set_num
legoSet.theme_id

*/



  return (
    <div>
      <h1>LEGO Sets</h1>
      <div className="lego-set-container">
        {legoSets.map((legoSet) => (
          <div className="lego-set-card" key={legoSet.set_num}>
            <h2>{legoSet.name}</h2>
            <p>Set Number: {legoSet.set_num}</p>
            <p>Theme: {legoSet.theme_id}</p>
            <p>Year: {legoSet.year}</p>
            <img src={legoSet.set_img_url} alt={`Image of ${legoSet.name}`} className="lego-set-image" />
            {/* Add more details as needed */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
