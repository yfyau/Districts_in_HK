import React, { Component } from 'react';
import './App.css';
import Map from './components/Map'
import ParallelCoordinate from './components/ParallelCoordinate'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Map/>
        <ParallelCoordinate></ParallelCoordinate>
      </div>
    );
  }
}

export default App;
