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
          <div>511 Major Housing Estates in Hong Kong</div>
          <p>short description</p>
        </div>

        <Map />

        <div className='heading'>
          <div>Monthly Air Pollution in Different Districts</div>
          <p>short description</p>
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
          <p>short description</p>
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