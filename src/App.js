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
            What are the correlations between different features? <br></br>
            Try the following to have a glance!
			<ul>
			<li> Select one or two features from the dropdown menus on the top of the map, and you will see colors filling it, </li>
            <li> Click on a district in the map, and see what people search the most about that district on the right, </li>
            <li> Or play around with the parallel coordinate at the map's bottom to look into specific features. </li>
			</ul>
          </p>
        </div>

        <Map />

        <div className='heading'>
          <div>Monthly Air Pollution in Different Districts</div>
          <p>Explore the patterns of air pollution in these breath-taking heatmaps (pun intended). The slider allows heatmap of a different timeframe to be shown.</p>
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
          <p>Check out the bubble plots to see how good people from different districts make a living.</p>
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