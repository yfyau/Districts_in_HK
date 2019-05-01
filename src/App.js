import React, { Component } from 'react';
import './App.css';
import Map from './components/Map'
import HeatMap from './components/HeatMap'
import Income from './components/Income'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Map/>
        <HeatMap/>
        <Income/>
      </div>
    );
  }
}

export default App;
