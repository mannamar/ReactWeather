import React from 'react'
import cloudy from '../assets/cloudy.png'
import './WeekCard.css'

export default function WeekCard(props) {
  return (
    <div className='weekCard d-flex flex-column align-items-center'>
        <p className='pt-4'>{props.title}</p>
        <img className='weekImg pt-3' src={cloudy} alt='Depicts current weather'/>
        <p className='pt-3'>{props.high}°</p>
        <p className='lowTxt pt-1'>L: {props.low}°</p>
    </div>
  )
}
