// Amardeep Mann  
// 3-24-23  
// React Weather App  
// We created a weather app in React based on our original Figma design that accesses the OpenWeatherAPI for its weather data  
// Peer Reviewed by Reed Goodwin: A good looking and well put together weather app. Lacking a functioning favorites but the icons are there and with a little more work could easily be applied.  Cohesive and responsive!

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import BigCard from './components/BigCard';

function App() {
  return (
    <BigCard/>
  );
}

export default App;