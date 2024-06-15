import React, { useEffect, useState } from 'react'

function GetCities() {
    const [cities, setCities] = useState([]);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchCities = async () => {
        // http://api.geonames.org/searchJSON?formatted=true&country=VN&maxRows=1000&featureCode=ADM3&username=${process.env.REACT_APP_GEONAMES_USERNAME}
        try {
          const response = await fetch(
            `http://api.geonames.org/searchJSON?formatted=true&country=VN&maxRows=1000&username=${process.env.REACT_APP_GEONAMES_USERNAME_USERNAME}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (data.geonames && data.geonames.length > 0) {
            setCities(data.geonames);
          } else {
            setError('No cities found.');
          }
        } catch (error) {
          console.error("Error fetching cities:", error);
          setError(error.message);
        }
      };
  
      fetchCities();
    }, []);
  
    return (
      <div>
        <h3>Danh sách các thành phố</h3>
        {error ? (
          <p>Error: {error}</p>
        ) : (
          <ul>
            {cities.map((city) => (
              <li key={city.geonameId}>{city.name}</li>
            ))}
          </ul>
        )}
      </div>
    );
}

export default GetCities
