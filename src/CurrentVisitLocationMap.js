// CurrentVisitLocationMap.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup,Polyline,Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix marker icon issue
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

const CurrentVisitLocationMap = () => {
  const [position, setPosition] = useState(null);
  const [address, setAddress] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [distance, setDistance] = useState(null);
    const [polylinePositions, setPolylinePositions] = useState([]);

  

  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const position = await new Promise((resolve, reject) => {

          console.log('navigator',navigator)
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        setPosition([position.coords.latitude, position.coords.longitude]);
      } catch (error) {
        console.error("Error getting current location:", error);
      }
    };

    getCurrentLocation();
  }, []);


  useEffect(() => {
    const getAddressFromCoordinates = async (latitude, longitude) => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
        const data = await response.json();

        console.log('data.display_name',data.display_name)
        setAddress(data.display_name);
      } catch (error) {
        console.error("Error getting address from coordinates:", error);
      }
    };
    
    if (position) {
      console.log('data.position',position)
      const [latitude, longitude] = position;
      getAddressFromCoordinates(latitude, longitude);
    }
  }, [position]);

  useEffect(() => {
    if (position && selectedPosition) {
      const [lat1, lon1] = position;
      const [lat2, lon2] = selectedPosition;
      const url = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          const dist = data.routes[0].distance / 1000; // convert to kilometers
          setDistance(dist.toFixed(2)); // round to 2 decimal places
        })
        .catch(error => {
          console.error("Error calculating distance:", error);
        });
    }
  }, [position, selectedPosition]);


  const handleSearch = (e) => {
    const searchTerm = e.target.value;
    if (!searchTerm) {
      setSelectedPosition(null);
      setPolylinePositions([]);
      return;
    }
  
    const geocoder = L.Control.Geocoder.nominatim();
    geocoder.geocode(searchTerm, (results) => {
      if (results && results.length > 0) {
        const latlng = [results[0].center.lat, results[0].center.lng];
        setSelectedPosition(latlng);
        setPolylinePositions([position, latlng]); // Update polyline positions
      }
    });
  };

  return (
    <div>
      <h3>Bản đồ vị trí thời điểm truy cập</h3>
      <p>Địa chỉ hiện tại: {address || 'Đang tải...'}</p>
      <input type="text" placeholder="Tìm kiếm địa chỉ..." onChange={handleSearch} />
      {position && selectedPosition && (
        <p>Khoảng cách: {distance} km</p>
      )}
      {position ? (
        <MapContainer center={position} zoom={14} style={{ height: '500px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        
        {position && selectedPosition && (
          <Polyline positions={[position, selectedPosition]}  color="red">
            <Popup direction="center" offset={[0, -20]}>
              {`Khoảng cách: ${distance} km`}
            </Popup>
          </Polyline>
        )}

          <Marker position={position}>
            <Tooltip>
              Vị trí của bạn
            </Tooltip>
          </Marker>
          {position && selectedPosition && (
          <Marker position={selectedPosition}>
            <Tooltip>
              Vị trí của của bạn đã tiềm
            </Tooltip>
          </Marker>
          )}
        </MapContainer>
      ) : (
        <p>Đang tải vị trí...</p>
      )}
    </div>
  );
};

export default CurrentVisitLocationMap;




