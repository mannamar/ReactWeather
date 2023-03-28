import React, { useState, useEffect } from 'react'
import './BigCard.css'
import { Container, Row, Col } from 'react-bootstrap';
import Weather from './Weather';
import { prod, dev } from '../api/environment';
import { MagnifyingGlass, List } from "@phosphor-icons/react";
import Favorites from './Favorites';

export default function BigCard() {

  // Variables
  const [apiKey, setApiKey] = useState(null);
  const [geoLat, setGeoLat] = useState(37.95);
  const [geoLon, setGeoLon] = useState(-121.29);
  const [chosenCityData, setChosenCityData] = useState(null);
  const [input, setInput] = useState('');

  const [showFavs, setShowFavs] = useState(false);

  // Functions
  function ChooseLocation(data) {
    if (data.length > 0) {
      let newChosenCity = data[0];
      for (let i = 0; i < data.length; i++) {
        if (data[i].country === 'US') {
          newChosenCity = data[i];
          break;
        }
      }
      setChosenCityData(newChosenCity);
    }
  }

  async function SearchForLocation(cityName, stateCode = '', countryCode = '', limit = 3) {
    let geocodingApi = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},${countryCode}&limit=${limit}&appid=${apiKey}`;
    const response = await fetch(geocodingApi);
    const data = await response.json();
    ChooseLocation(data);
  }

  const handleKeyDown = async (event) => {
    if (event.key === 'Enter') {
      handleClick();
    }
  }

  const handleClick = async () => {
    if (input.length > 0) {
      let inputSplit = input.split(',');
      setInput('');

      if (inputSplit.length === 1) {
        await SearchForLocation(inputSplit[0]);
      } else {
        await SearchForLocation(inputSplit[0], inputSplit[1]);
      }
    }
  }

  const clickFavs = () => {
    setShowFavs(!showFavs);
  }

  // Call effect at page load
  useEffect(() => {

    // Set geo-location functions
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    async function success(position) {
      let newLat = position.coords.latitude;
      let newLon = position.coords.longitude;
      setGeoLat(newLat);
      setGeoLon(newLon);
    }

    async function error(err) {
      console.warn(err.message);
      setGeoLat(37.9577016);
      setGeoLon(-121.2907796);
    }


    // Get API key
    let newApiKey = '';

    if (prod.isLive) {
      newApiKey = prod.apiKey;
    } else {
      newApiKey = dev.apiKey;
    }
    setApiKey(newApiKey);

    // Execute geo-location lookup
    navigator.geolocation.getCurrentPosition(success, error, options);

  }, []);

  // Call effect at geo-loc found
  useEffect(() => {
    async function ReverseGeoLookup() {
      let reverseGeoApi = `https://api.openweathermap.org/geo/1.0/reverse?lat=${geoLat}&lon=${geoLon}&limit=1&appid=${apiKey}`;
      let response = await fetch(reverseGeoApi);
      let data = await response.json();
      let newCCD = data[0];
      setChosenCityData(newCCD);
    }

    if (apiKey !== null) {
      ReverseGeoLookup();
    }

  }, [geoLat]);


  return (
    <div className='bigCard'>

      <Container fluid className='innerCont'>

        <Row className='searchRow'>
          <Col>
            <div className='d-flex'>
              <input className='inp' type='text' value={input} placeholder='Search' onKeyDown={handleKeyDown} onChange={(e) => { setInput(e.target.value) }}></input>
              <button className='btn' onClick={handleClick}>
                <MagnifyingGlass color="#fff0f0" weight="bold" className="icon" />
              </button>
              <button className='btn' onClick={clickFavs}>
                <List color="#fff0f0" weight="bold" className="icon" />
              </button>
            </div>
          </Col>
        </Row>

        {showFavs ? <Favorites setShowFavs={setShowFavs}/> : <Weather data={chosenCityData} apiKey={apiKey} />}

      </Container>

    </div>
  )
}