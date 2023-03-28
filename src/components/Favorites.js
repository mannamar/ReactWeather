import React, {useState, useEffect} from 'react';
import './Favorites.css';
import { Container, Row, Col } from 'react-bootstrap';
import FavCard from './FavCard';

export default function Favorites(props) {
    const [favs, setFavs] = useState([]);

    useEffect(() => {
        // Local storage
        const newFavs = JSON.parse(localStorage.getItem('favs'));
        if (newFavs) {
            setFavs(newFavs);
        }
    }, []);

    return (
        <Container>
            <Row className='favRow g-4'>
                
                {favs.map((city, index) => {
                    return (
                        <Col xs={6} md={4} key={index}>
                            <FavCard setShowFavs={props.setShowFavs} name={city}/>
                        </Col>
                    )
                })};

            </Row>
        </Container>
    )
}
