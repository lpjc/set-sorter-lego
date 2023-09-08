import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import Axios

function App() {
  const [legoSets, setLegoSets] = useState([]);
  const apiKey = 'e00fe84219678222906b99be611d12c1'; // Replace with your actual API key

  useEffect(() => {
    // Define the Rebrickable API endpoint
    const apiUrl = 'https://rebrickable.com/api/v3/lego/sets/?page=1&page_size15&ordering=year';

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

  return (
    <div>
      <h1>LEGO Sets</h1>
      {legoSets.length > 0 ? (
        <ul>
          {legoSets.map((legoSet) => (
            <li key={legoSet.set_num}>
              <h2>{legoSet.name}</h2>
              <img src={legoSet.set_img_url} alt={`Image of ${legoSet.name}`} />
              <p>Set Number: {legoSet.set_num}</p>
              <p>Theme: {legoSet.theme_id}</p>
              <p>Year: {legoSet.year}</p>
              {/* Add more details as needed */}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading LEGO set information...</p>
      )}
    </div>
  );
}

export default App;
