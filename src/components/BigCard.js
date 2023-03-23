import React from 'react'
import './BigCard.css'
import { Button, Container, Row, Col } from 'react-bootstrap';
import cloudy from '../assets/cloudy.png'
import TodayCard from './TodayCard';
import WeekCard from './WeekCard';

export default function BigCard() {
  return (
    <div className='bigCard'>

      <Container className='innerCont'>
        <Row className='searchRow'>
          <Col>
            <input className='inp' type='text' value='' placeholder='Search'></input>
            <Button className='btn'>S</Button>
            <Button className='btn'>F</Button>
          </Col>
        </Row>
        <Row className='nowRow'>
          <Col sm={4}>
              <div className='d-flex'>
                <img className='bigImg align-self-start' src={cloudy} alt='Depicts current weather'/>
                <p className='bigTemp'>58°</p>
              </div>
              <p className='cityTxt'>Stockton, CA</p>
              <p className='weathTxt'>Partly Cloudy</p>
          </Col>
          <Col sm={8}>
            <div className='d-flex justify-content-between'>
              <TodayCard />
              <TodayCard />
              <TodayCard />
            </div>
          </Col>
        </Row>
        <Row>
          <div className='weekRow d-flex justify-content-between'>
            <WeekCard/>
            <WeekCard/>
            <WeekCard/>
            <WeekCard/>
            <WeekCard/>
          </div>
        </Row>
      </Container>

    </div>
  )
}