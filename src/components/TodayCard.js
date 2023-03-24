import React from 'react';
import './TodayCard.css';

export default function TodayCard(props) {

    function returnTemp(val) {
        let temp = '52';
        if (val === 'min' || val === 'max') {
            temp = Math.round(props.data[props.array[0]][props.val]);
        } else if (val === 'later') {
            temp = Math.round(props.data.list[1].main.temp);
            // console.log(props.data)
        }
        return temp;
    }

    function returnWeath(val) {
        let weath = 'Clear';
        if (val === 'max') {
            weath = props.data[props.array[0]].max_weath;
        } else if (val === 'min') {
            weath = props.data[props.array[0]].min_weath;
        }
        else if (val === 'later') {
            weath = props.data.list[1].weather[0].main;
        }
        return weath;
    }

    return (
        <div className='todayCard d-flex flex-column justify-content-between align-items-center'>
            <p>{props.title}</p>
            <img className='todayImg' src={require(`../assets/${(props.data !== null ? returnWeath(props.val) : 'Clear')}.png`)} alt='Depicts current weather' />
            <p>{props.data !== null ? returnTemp(props.val) : '57'}°</p>
        </div>
    )
}