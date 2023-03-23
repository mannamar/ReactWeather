import React from 'react'
import './BigCard.css'
import { Button, Container, Row, Col } from 'react-bootstrap';

export default function BigCard() {
  return (
    <div className='bigCard'>

      <Container className='innerCont'>
        <Row>
          <input className='inp' type='text' value='' placeholder='Search'></input>
          <Button className='btn'>S</Button>
          <Button className='btn'>F</Button>
        </Row>
      </Container>

        <div className='searchRow d-flex'>
            <input className='inp' type='text' value='' placeholder='Search'></input>
            <Button className='btn'>S</Button>
            <Button className='btn'>F</Button>
        </div>

        <div></div>
    </div>
  )
}