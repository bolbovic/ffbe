import React, { Component } from 'react';
import ImageSaver from './components/ImageSaver';
import UploadList from './components/UploadList';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <ImageSaver />
        </div>
        <div className="App-intro">
          <UploadList />
        </div>
      </div>
    );
  }
}

export default App;
