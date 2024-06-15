// App.js
import React, { useEffect, useState } from 'react';
// import Dc from './khoang';
import CurrentVisitLocationMap from './CurrentVisitLocationMap.js';
import Khoang from './Khoang.js';
import GetCities from './GetCities.js';
import Wards from './Wards.js';
import Addresses from './Addresses.js';

function App() {
  

  // console.log('REACT_YOUR_GEONAMES_USERNAME',process.env.REACT_APP_GEONAMES_USERNAME_USERNAME)


  return (
    <div className="App">
     {/* <h1>My MapTiler Map</h1>
     <MapComponent /> */}

     <CurrentVisitLocationMap/>
     {/* <Khoang/> */}

     {/* <GetCities/> */}

     {/* <Addresses/> */}

     
     {/* <Wards/> */}
     



    </div>
  );
}

export default App;
