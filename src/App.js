import React, { Component } from 'react';
import ImageAnalyzer from './analyzer/ImageAnalyzer';

import logo from './logo.svg';
import './App.css';

let testImage1 = require('../data/838446Capture.png');

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div className="App-intro">
          <ImageAnalyzer src={ testImage1 } />
        </div>
      </div>
    );
  }
}

export default App;
