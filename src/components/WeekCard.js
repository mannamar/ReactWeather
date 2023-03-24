import React from 'react'
import Clouds from '../assets/Clouds.png'
import './WeekCard.css'

export default function WeekCard(props) {

    function returnWeather(array) {
        let tempWeath;
        if (array.all_weath.includes('Snow')) {
            tempWeath = 'Snow';
        } else if (array.all_weath.includes('Thunderstorm')) {
            tempWeath = 'Thunderstorm';
        } else if (array.all_weath.includes('Rain')) {
            tempWeath = 'Rain';
        } else if (array.all_weath.includes('Drizzle')) {
            tempWeath = 'Drizzle';
            // } else if (parsedFutureData[dayOfWeekOrder[dayNum]].all_weath.includes('Clouds')) {
            //     tempWeath = 'Clouds'; // Always ends up cloudy
        } else {
            tempWeath = 'Clear';
        }
        return tempWeath;
    }


    return (
        <div className='weekCard d-flex flex-column align-items-center'>
            <p className='pt-4'>{props.array !== null ? props.array[props.num] : props.title}</p>
            <img className='weekImg pt-3' src={require(`../assets/${(props.data !== null ? returnWeather(props.data[props.array[props.num]]) : 'Clear')}.png`)} alt='Depicts current weather' />
            <p className='pt-3'>{props.data !== null ? Math.round(props.data[props.array[props.num]].max) : '57'}°</p>
            <p className='lowTxt pt-1'>L: {props.data !== null ? Math.round(props.data[props.array[props.num]].min) : '35'}°</p>
        </div>
    )
}
