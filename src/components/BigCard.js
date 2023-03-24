import React, { useState, useEffect } from 'react'
import './BigCard.css'
import { Container, Row, Col } from 'react-bootstrap';
import TodayCard from './TodayCard';
import WeekCard from './WeekCard';
import { prod, dev } from '../api/environment';
import { stateAbbr } from '../api/states';
import { MagnifyingGlass, List } from "@phosphor-icons/react";

export default function BigCard() {

  // Variables
  const [apiKey, setApiKey] = useState(null);
  const [geoLat, setGeoLat] = useState(37.95);
  const [geoLon, setGeoLon] = useState(-121.29);
  const [chosenCityData, setChosenCityData] = useState(null);
  const [weatherNowData, setWeatherNowData] = useState(null);
  const [weatherFutueData, setWeatherFutureData] = useState(null);
  const [parsedFWD, setParsedFWD] = useState(null);
  const [dOWO, setDOWO] = useState(null);
  const [displayName, setDisplayName] = useState('Loading...');

  const [input, setInput] = useState('');

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

  function SetDisplayNameVariables() {
    let newName;
    let newState;
    let newDisplayName;
    if (chosenCityData.local_names && chosenCityData.local_names.en) {
      newName = chosenCityData.local_names.en;
    } else {
      newName = chosenCityData.name;
    }
    if (chosenCityData.country === 'US' && chosenCityData.state) {
      newState = chosenCityData.state;
    } else {
      newState = chosenCityData.country;
    }

    if (stateAbbr[newState]) {
      newDisplayName = newName + ', ' + stateAbbr[newState];
    } else if (newState && newState.length === 2) {
      newDisplayName = newName + ', ' + newState;
    } else {
      newDisplayName = newName;
    }

    setDisplayName(newDisplayName);
  }

  async function GetNowData() {
    let weatherNowApi = `https://api.openweathermap.org/data/2.5/weather?lat=${chosenCityData.lat}&lon=${chosenCityData.lon}&appid=${apiKey}&units=imperial`;
    let response = await fetch(weatherNowApi);
    let data = await response.json();
    let newWND = data;
    setWeatherNowData(newWND);
  }

  async function GetFutureData() {
    let weatherNowApi = `https://api.openweathermap.org/data/2.5/forecast?lat=${chosenCityData.lat}&lon=${chosenCityData.lon}&appid=${apiKey}&units=imperial`;
    let response = await fetch(weatherNowApi);
    let data = await response.json();
    let newWFD = data;
    setWeatherFutureData(newWFD);

    // From ParseFutureData()
    let list = newWFD.list;
    let parsedFutureData = {};
    let dayOfWeekOrder = [];
    for (let element of list) {
      let tempUnixTime = element.dt;
      let tempDateTime = new Date(tempUnixTime * 1000);
      let dayOfWeek = tempDateTime.toLocaleDateString('en-US', { weekday: "short" }).toUpperCase();

      if (!dayOfWeekOrder.includes(dayOfWeek)) {
        dayOfWeekOrder.push(dayOfWeek);
        parsedFutureData[dayOfWeek] = {};
        parsedFutureData[dayOfWeek].all_weath = [];
      }
      if (!parsedFutureData[dayOfWeek].max || element.main.temp > parsedFutureData[dayOfWeek].max) {
        parsedFutureData[dayOfWeek].max = element.main.temp;
        parsedFutureData[dayOfWeek].max_weath = element.weather[0].main;
      }
      if (!parsedFutureData[dayOfWeek].min || element.main.temp < parsedFutureData[dayOfWeek].min) {
        parsedFutureData[dayOfWeek].min = element.main.temp;
        parsedFutureData[dayOfWeek].min_weath = element.weather[0].main;
      }
      if (!parsedFutureData[dayOfWeek].all_weath.includes(element.weather[0].main)) {
        parsedFutureData[dayOfWeek].all_weath.push(element.weather[0].main);
      }
    }
    setParsedFWD(parsedFutureData);
    setDOWO(dayOfWeekOrder);
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

  // At page load
  useEffect(() => {

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
      // await ReverseGeoLookup();
    }

    async function error(err) {
      console.warn(err.message);
      setGeoLat(37.9577016);
      setGeoLon(-121.2907796);
    }



    let newApiKey = '';

    if (prod.isLive) {
      newApiKey = prod.apiKey;
    } else {
      newApiKey = dev.apiKey;
    }
    setApiKey(newApiKey);

    navigator.geolocation.getCurrentPosition(success, error, options);


  }, []);

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

  useEffect(() => {
    if (chosenCityData !== null) {
      SetDisplayNameVariables();
      GetNowData();
      GetFutureData();
    }
  }, [chosenCityData]);

  return (
    <div className='bigCard'>

      <Container fluid className='innerCont'>
        <Row className='searchRow'>
          <Col>
            <div className='d-flex'>
              <input className='inp' type='text' value={input} placeholder='Search' onKeyDown={handleKeyDown} onChange={(e) => { setInput(e.target.value) }}></input>
              <button className='btn' onClick={handleClick}>
                <MagnifyingGlass color="#fff0f0" weight="bold" className="icon"/>
              </button>
              <button className='btn'>
                <List color="#fff0f0" weight="bold" className="icon"/>
              </button>
            </div>
          </Col>
        </Row>
        <Row className='nowRow'>
          <Col sm={12} lg={5}>
            <div className='nowBox'>
            <Row>
              <Col md={6} lg={12}>
                <div className='d-flex'>
                  <img className='bigImg align-self-start' src={require(`../assets/${(weatherNowData !== null ? weatherNowData.weather[0].main : 'Clear')}.png`)} alt='Depicts current weather' />
                  <p className='bigTemp'>{weatherNowData !== null ? Math.round(weatherNowData.main.temp) : '--'}°</p>
                </div>
              
              </Col>
              <Col md={6} lg={12}>
                <div className='cityBox'>
                  <p className='cityTxt'>{displayName}</p>
                  <p className='weathTxt gray'>{weatherNowData !== null ? weatherNowData.weather[0].main : 'Clear'}</p>
                </div>
              </Col>
            </Row>
            </div>
          </Col>
          <Col sm={12} lg={7}>
            <div className='todayBox d-flex justify-content-between'>
              <TodayCard title='High' data={parsedFWD} array={dOWO} val='max'/>
              <TodayCard title='Low' data={parsedFWD} array={dOWO} val='min'/>
              <TodayCard title='+4hrs' data={weatherFutueData} array={dOWO} val='later'/>
            </div>
          </Col>
        </Row>
        <Row>
          <div className='weekRow d-flex justify-content-between'>
            <WeekCard title='MON' num={0} data={parsedFWD} array={dOWO}/>
            <WeekCard title='TUE' num={1} data={parsedFWD} array={dOWO}/>
            <WeekCard title='WED' num={2} data={parsedFWD} array={dOWO}/>
            <WeekCard title='THU' num={3} data={parsedFWD} array={dOWO}/>
            <WeekCard title='FRI' num={4} data={parsedFWD} array={dOWO}/>
          </div>
        </Row>
      </Container>

    </div>
  )
}