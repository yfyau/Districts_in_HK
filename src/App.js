import React, { Component } from 'react';
import './App.css';
import Map from './components/Map'
import ParallelCoordinate from './components/ParallelCoordinate'
import HeatMap from './components/HeatMap'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Map/>
        <ParallelCoordinate></ParallelCoordinate>
        <HeatMap/>
      </div>
    );
  }
}

export default App;
