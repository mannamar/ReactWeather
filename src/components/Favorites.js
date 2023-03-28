import React from 'react';
import './Favorites.css';
import { Container, Row, Col } from 'react-bootstrap';
import FavCard from './FavCard';

export default function Favorites() {
  return (
    <Container>
        <Row className='favRow'>
            <Col xs={4}>
                <FavCard />
            </Col>
        </Row>
    </Container>
  )
}
