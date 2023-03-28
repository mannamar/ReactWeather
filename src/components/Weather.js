import React, { useState, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap';
import TodayCard from './TodayCard';
import WeekCard from './WeekCard';
import { stateAbbr } from '../api/states';
import { Star } from "@phosphor-icons/react";

export default function Weather(props) {

    // Variables
    const [weatherNowData, setWeatherNowData] = useState(null);
    const [weatherFutueData, setWeatherFutureData] = useState(null);
    const [parsedFWD, setParsedFWD] = useState(null);
    const [dOWO, setDOWO] = useState(null);
    const [displayName, setDisplayName] = useState('Loading...');
    const [isFav, setIsFav] = useState(false);

    const [favs, setFavs] = useState([]);

    // Functions
    function SetDisplayNameVariables() {
        let newName;
        let newState;
        let newDisplayName;
        if (props.data.local_names && props.data.local_names.en) {
            newName = props.data.local_names.en;
        } else {
            newName = props.data.name;
        }
        if (props.data.country === 'US' && props.data.state) {
            newState = props.data.state;
        } else {
            newState = props.data.country;
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
        let weatherNowApi = `https://api.openweathermap.org/data/2.5/weather?lat=${props.data.lat}&lon=${props.data.lon}&appid=${props.apiKey}&units=imperial`;
        let response = await fetch(weatherNowApi);
        let data = await response.json();
        let newWND = data;
        setWeatherNowData(newWND);
    }

    async function GetFutureData() {
        let weatherNowApi = `https://api.openweathermap.org/data/2.5/forecast?lat=${props.data.lat}&lon=${props.data.lon}&appid=${props.apiKey}&units=imperial`;
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

    function checkFav() {
        setIsFav(favs.includes(displayName));
    }

    // Event handlers
    const clickFav = () => {
        if (displayName === 'Loading...') {
            return;
        }

        let newFavs;
        if (isFav) {
            let index = favs.indexOf(displayName);
            newFavs = [
                ...favs.slice(0, index),
                ...favs.slice(index + 1)
              ]
        } else {
            newFavs = [...favs, displayName];
        }
        setFavs(newFavs);
        localStorage.setItem('favs', JSON.stringify(newFavs));
        setIsFav(!isFav);
    }

    // Call effect when passed in chosenCityData changes
    useEffect(() => {
        if (props.data !== null) {
            SetDisplayNameVariables();
            GetNowData();
            GetFutureData();
        }
        
    }, [props.data]);
    
    useEffect(() => {
        // Local storage
        const newFavs = JSON.parse(localStorage.getItem('favs'));
        if (newFavs) {
            setFavs(newFavs);
        }
        checkFav();
    }, [displayName]);

    return (
        <>
            <Row className='nowRow'>
                <Col sm={12} lg={5}>
                    <div className='nowBox'>
                        <Row>
                            <Col md={6} lg={12}>
                                <div className='d-flex topNowBox'>
                                    <img className='bigImg align-self-start' src={require(`../assets/${(weatherNowData !== null ? weatherNowData.weather[0].main : 'Clear')}.png`)} alt='Depicts current weather' />
                                    <p className='bigTemp'>{weatherNowData !== null ? Math.round(weatherNowData.main.temp) : '--'}°</p>
                                    <Star className="star" color="#ffd400" weight={isFav ? 'fill' : 'bold'} onClick={clickFav} />
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
                        <TodayCard title='High' data={parsedFWD} array={dOWO} val='max' />
                        <TodayCard title='Low' data={parsedFWD} array={dOWO} val='min' />
                        <TodayCard title='+4hrs' data={weatherFutueData} array={dOWO} val='later' />
                    </div>
                </Col>
            </Row>
            <Row>
                <div className='weekRow d-flex justify-content-between'>
                    <WeekCard title='MON' num={0} data={parsedFWD} array={dOWO} />
                    <WeekCard title='TUE' num={1} data={parsedFWD} array={dOWO} />
                    <WeekCard title='WED' num={2} data={parsedFWD} array={dOWO} />
                    <WeekCard title='THU' num={3} data={parsedFWD} array={dOWO} />
                    <WeekCard title='FRI' num={4} data={parsedFWD} array={dOWO} />
                </div>
            </Row>
        </>
    )
}
