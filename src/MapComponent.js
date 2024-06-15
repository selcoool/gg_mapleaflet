import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  const maptilerApiKey = 'pY4yiVQ5Wm5x8frZ7ljc'; // Replace with your MapTiler API key


  // useEffect(() => {
  //   const getCurrentLocation = async () => {
  //     try {
  //       const position = await new Promise((resolve, reject) => {
  //         navigator.geolocation.getCurrentPosition(resolve, reject);
  //       });
  //       setPosition([position.coords.latitude, position.coords.longitude]);
  //     } catch (error) {
  //       console.error("Error getting current location:", error);
  //     }
  //   };

  //   getCurrentLocation();
  // }, []);

  return (
    <MapContainer center={[ 3.121707,101.7182277,15]} zoom={13} style={{ height: '100vh', width: '100%' }}
  
    >
      <TileLayer
        url={`https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=pY4yiVQ5Wm5x8frZ7ljc`}
        attribution='&copy; <a href="https://www.maptiler.com/copyright/">MapTiler</a> contributors'
      />

           <Marker position={[ 3.121707,101.7182277,15]}>
            <Popup>
              Vị trí của bạn
            </Popup>
          </Marker>
    </MapContainer>
  );
};

export default MapComponent;
