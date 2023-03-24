import React from 'react'
import cloudy from '../assets/cloudy.png'
import './WeekCard.css'

export default function WeekCard(props) {
  return (
    <div className='weekCard d-flex flex-column align-items-center'>
        <p className='pt-4'>{props.array !== null ? props.array[props.num] : props.title }</p>
        <img className='weekImg pt-3' src={cloudy} alt='Depicts current weather'/>
        <p className='pt-3'>{props.data !== null ? Math.round(props.data[props.array[props.num]].max) : '57'}°</p>
        <p className='lowTxt pt-1'>L: {props.data !== null ? Math.round(props.data[props.array[props.num]].min) : '35'}°</p>
    </div>
  )
}
