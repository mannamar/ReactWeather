import React from 'react'
import cloudy from '../assets/cloudy.png'
import './WeekCard.css'

export default function WeekCard() {
  return (
    <div className='weekCard d-flex flex-column align-items-center'>
        <p className='pt-4'>TUE</p>
        <img className='weekImg pt-3' src={cloudy} alt='Depicts current weather'/>
        <p className='pt-3'>58°</p>
        <p className='lowTxt pt-1'>L: 35°</p>
    </div>
  )
}
