// MapWithSearch.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

// Fix marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapWithSearch = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [searchPosition, setSearchPosition] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        setCurrentPosition([position.coords.latitude, position.coords.longitude]);
      } catch (error) {
        console.error("Error getting current location:", error);
      }
    };

    getCurrentLocation();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchTerm}`);
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setSearchPosition([parseFloat(lat), parseFloat(lon)]);
        setError(null);
      } else {
        setError('Không tìm thấy địa điểm');
      }
    } catch (error) {
      setError('Lỗi khi tìm kiếm địa điểm');
    }
  };

  const LocateControl = () => {
    const map = useMapEvents({
      click() {
        map.locate();
      },
      locationfound(e) {
        setCurrentPosition([e.latlng.lat, e.latlng.lng]);
        map.flyTo(e.latlng, map.getZoom());
      },
    });

    return null;
  };

  return (
    <div>
      <h3>Tìm địa điểm</h3>
      <input 
        type="text" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
        placeholder="Nhập tên địa điểm" 
      />
      <button onClick={handleSearch}>Tìm kiếm</button>
      {error && <p>{error}</p>}
      <MapContainer center={currentPosition || [0, 0]} zoom={14} style={{ height: '500px', width: '100%' }}>
        <LocateControl />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {currentPosition && (
          <Marker position={currentPosition}>
            <Popup>
              Vị trí của bạn
            </Popup>
          </Marker>
        )}
        {searchPosition && (
          <Marker position={searchPosition}>
            <Popup>
              {searchTerm}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MapWithSearch;
