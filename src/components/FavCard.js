import React from 'react'

export default function FavCard(props) {
    const clickFav = () => {
        // Work in progress
        props.setShowFavs(false);
    }

    return (
        <div className="favCard" onClick={clickFav}>
            <p className='favName'>{props.name}</p>
        </div>
    )
}
