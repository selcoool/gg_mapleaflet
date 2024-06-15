// CurrentLocationMap.js
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

const LocationMap = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchPosition, setSearchPosition] = useState(null);
  const [error, setError] = useState(null);
  const [distance, setDistance] = useState(null);

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
  });

  const handleSearch = async () => {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${searchTerm}`);
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        setSearchPosition([parseFloat(lat), parseFloat(lon)]);
        setError(null);

        if (currentPosition) {
          const distance = calculateDistance(currentPosition[0], currentPosition[1], parseFloat(lat), parseFloat(lon));
          setDistance(distance);
        }
      } else {
        setError('Không tìm thấy địa điểm');
      }
    } catch (error) {
      setError('Lỗi khi tìm kiếm địa điểm');
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1); // deg2rad below
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(2);
  };

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
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
      <h3>Vị trí hiện tại của bạn</h3>
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Nhập địa chỉ cần tìm"
        />
        <button onClick={handleSearch}>Tìm kiếm</button>
      </div>
      {error && <p>{error}</p>}
      {distance && <p>Khoảng cách: {distance} km</p>}
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

export default LocationMap;
