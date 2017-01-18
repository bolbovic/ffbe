import React, { Component } from 'react';
//import ImageAnalyzer from './analyzer/ImageAnalyzer';
import ImageSaver from './components/ImageSaver';

import logo from './logo.svg';
import './App.css';

//let testImage1 = require('../data/838446Capture.png');
//let testImage1 = require('../data/EKdwelo.jpg');
//let testImage1 = require('../data/I3QaQZo.png');
//let testImage1 = require('../data/lM79ie2.png');
//let testImage1 = require('../data/X0bzo8f.png');

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <div className="App-intro">
          <ImageSaver />
        </div>
      </div>
    );
  }
}
          //<ImageAnalyzer src={ testImage1 } />

export default App;
