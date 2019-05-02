import React, { Component } from 'react';
import './App.css';
import Map from './components/Map'
import HeatMap from './components/HeatMap'
import Income from './components/Income'

import PageScroller from './components/PageScroller'

class App extends Component {
  render() {
    return (
      <div className="App">
        <PageScroller
          ref={ref => this._pageScroller = ref}
          containerHeight="100%"
          containerWidth="100%"
        >
          <Map />
          <HeatMap />
          <Income />
        </PageScroller>
      </div>
    );
  }
}

export default App;
