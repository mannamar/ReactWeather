import React from 'react'
import './TodayCard.css'
import cloudy from '../assets/cloudy.png'

export default function TodayCard(props) {
  return (
    <div className='todayCard d-flex flex-column justify-content-between align-items-center'>
        <p>{props.title}</p>
        <img className='todayImg' src={cloudy} alt='Depicts current weather'/>
        <p>36°</p>
    </div>
  )
}