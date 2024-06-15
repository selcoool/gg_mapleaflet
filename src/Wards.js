import React, { useEffect, useState } from 'react'

function Wards() {
    const [divisions, setDivisions] = useState([]);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchDivisions = async () => {
        try {
          const response = await fetch(
            `http://api.geonames.org/searchJSON?formatted=true&country=VN&maxRows=1000&featureCode=ADM3&username=trmthanh_220895`
          );
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (data.geonames && data.geonames.length > 0) {
            setDivisions(data.geonames);
          } else {
            setError('No divisions found.');
          }
        } catch (error) {
          console.error("Error fetching divisions:", error);
          setError(error.message);
        }
      };
  
      fetchDivisions();
    }, []);
  
    return (
      <div>
        <h3>Danh sách xã, thị trấn và tỉnh</h3>
        {error ? (
          <p>Error: {error}</p>
        ) : (
          <ul>
            {divisions.map((division) => (
              <li key={division.geonameId}>{division.name}, {division.adminName1}</li>
            ))}
          </ul>
        )}
      </div>
    );
}

export default Wards
