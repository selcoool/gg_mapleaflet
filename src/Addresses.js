import React, { useEffect, useState } from 'react'

function Addresses() {
    const [houseNumbers, setHouseNumbers] = useState([]);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchHouseNumbers = async () => {
        try {
          const response = await fetch(
            `http://api.geonames.org/searchJSON?formatted=true&country=VN&maxRows=1000&featureCode=H&username=${process.env.REACT_APP_GEONAMES_USERNAME_USERNAME}`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (data.geonames && data.geonames.length > 0) {
            setHouseNumbers(data.geonames);
          } else {
            setError('No house numbers found.');
          }
        } catch (error) {
          console.error("Error fetching house numbers:", error);
          setError(error.message);
        }
      };
  
      fetchHouseNumbers();
    }, []);
  
    return (
      <div>
        <h3>Danh sách số địa chỉ</h3>
        {error ? (
          <p>Error: {error}</p>
        ) : (
          <ul>
            {houseNumbers.map((houseNumber) => (
              <li key={houseNumber.geonameId}>{houseNumber.name}</li>
            ))}
          </ul>
        )}
      </div>
    );
}

export default Addresses
