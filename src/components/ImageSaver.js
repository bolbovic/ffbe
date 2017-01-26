import React from 'react';
import { DatabaseRef } from '../config/Firebase';
import Uploader from '../components/Uploader.js';

//let iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

class ImageAnalyzer extends React.Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      logs: [],
      screens: []
    };
    this.db = DatabaseRef.child('uploads');
  }

  uploadComplete = (params) => {
    console.log(JSON.parse(params.response.rawResponse.rawResponse));
    let ref = this.db.push();
    ref.set({
      id: ref.key,
      cloudinary: JSON.parse(params.response.rawResponse.rawResponse),
      type: '11pull'
    });
  }

  uploadError = (p) => {
    console.log('uploadError');
    console.log(p);
  }

  uploadPreparing = (p) => {
    console.log('uploadPreparing');
    console.log(p);
  }

  uploadProgress = (p) => {
    console.log('uploadProgress');
    console.log(p);
  }

  renderInput () {
    let uploadConf = {
      request: {
        name: 'file',
        url: 'https://api.cloudinary.com/v1_1/bolbo/image/upload',
        params: {
          'upload_preset': 'pqbwsewj',
          tags: ['11pulls']
        }
      }
    };
    return (
      <Uploader
        uploadComplete={ this.uploadComplete }
        uploadConf={ uploadConf }
        uploadError={ this.uploadError }
        uploadPreparing={ this.uploadPreparing }
        uploadProgress={ this.uploadProgress }
      >
          <div>{ 'ADD FILES' }</div>
      </Uploader>
    );
  }

  render() {
    return (
      <div className="image-saver" id={this.me}>
        <div className="debug">
          { '!!Debug window!!' }
          { this.state.logs.map( (log, key) => {
            return (<div key={ key }>{ log }</div>);
          }) }
        </div>
        { this.renderInput() }
      </div>
    );
  }
  /* End React Component LifeCycle Methods */
}

export default ImageAnalyzer;

//Unit test entry point
export const _ImageAnalyzer = ImageAnalyzer;