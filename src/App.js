import React, { Component } from 'react';
import './App.css';
import VegaLite from 'react-vega-lite';
import { Handler } from 'vega-tooltip';
import Map from './components/Map'
import HeatMap from './components/HeatMap'
import { AirPollutionAcrossAlYearsSpec, IncomeSpec, IncomeBySexSpec } from './specs';

class App extends Component {
  render() {
    return (
      <div className="App">

        <div className='heading'>
          <div>511 Major Housing Estates Visualized</div>
          <p>
            How is it like living in different districts in Hong Kong? 
            What are the correlations between different features?
            Try selecting features from the dropdown menus on top, and see them visualized on the map.
            Or try clicking on a district, and see what people search the most about that district.
            At the bottom, try play around with the parallel coordinates to look into specific features in detail.
          </p>
        </div>

        <Map />

        <div className='heading'>
          <div>Monthly Air Pollution in Different Districts</div>
          <p>Explore the patterns of air pollution in the breath-taking heatmaps (pun inteended). You can also choose a specific timeframe from the dropdown menu.</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <HeatMap />
          <VegaLite
            spec={AirPollutionAcrossAlYearsSpec}
            tooltip={new Handler().call}
          />
        </div>

        <div className='heading'>
          <div>Median Income of People in Different Districts</div>
          <p>Check out the bubble plots to see how much do people from different districts make.</p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
          <VegaLite
            spec={IncomeSpec}
            tooltip={new Handler().call}
          />
          <VegaLite
            spec={IncomeBySexSpec}
            tooltip={new Handler().call}
          />
        </div>

      </div>
    );
  }
}

export default App;