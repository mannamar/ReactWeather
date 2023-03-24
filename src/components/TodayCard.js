import React from 'react'
import './TodayCard.css'
import Clouds from '../assets/Clouds.png'

export default function TodayCard(props) {
  return (
    <div className='todayCard d-flex flex-column justify-content-between align-items-center'>
        <p>{props.title}</p>
        <img className='todayImg' src={Clouds} alt='Depicts current weather'/>
        <p>36°</p>
    </div>
  )
}