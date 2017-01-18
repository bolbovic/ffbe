import React from 'react';
import { DatabaseRef } from '../config/Firebase';

let iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

class ImageAnalyzer extends React.Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      logs: [],
      screens: []
    };
    this.db = DatabaseRef.child('uploads');
  }

  handleClick = () => {
    this.log('Click triggered...');
    this.log(document.getElementById('files').toString());
    this.log(document.getElementById('files').files.length.toString());
    this.readFiles(document.getElementById('files').files);
  }

  handleChange = (evt) => {
    let files = evt.target.files;
    this.log('Change triggered...');
    this.log(files.toString());
    this.log(files.length.toString());
    this.readFiles(files);
  }

  log(str) {
    let logs = this.state.logs;
    logs.push(str);
    this.setState({logs});
  }

  readFiles(files) {
    this.setState({screens:[]});
    this.log( 'Reading files now...' );
    if ( FileReader ) {
      this.log( 'FileReader is here' );
    } else {
      this.log( 'No FileReader...' );
    }
    for ( let i = 0; i < files.length; i++ ) {
      let file = files[i];
      if (FileReader) {
        this.log( `Reading file ${file.name}`);
        let fr = new FileReader();
        fr.onload = () => {
          //let { screens } = this.state;
          //screens.push({key:i, data: fr.result});
          //this.setState({screens});
          let img = new Image();
          img.onload = (evt) => {
            let i = evt.target;
            let cv = document.createElement('canvas');
            cv.width = 360;
            cv.height = img.height * 360 / img.width;
            cv.getContext('2d').drawImage(
              img,
              0, 0, img.width, img.height,
              0, 0, cv.width, cv.height
            );
            // Saving data
            //let src = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height);
            let src = cv.toDataURL();
            let ref = this.db.push();
            ref.set({
              id: ref.key,
              src,
              type: '10pull'
            });
            console.log('Image saved');
          }
          img.src = fr.result;
        };
        fr.readAsDataURL(file);
      }
    }
    this.log( 'Finish reading files' );
  }

  renderInput () {
    return ( iOS ?
      <div>
        <input
          id="files"
          multiple={ true }
          onChange={ this.handleChange }
          type="file"
        />
        <input
          id="button-analyze"
          onClick={ this.handleClick }
          type="button"
          value="Analyze"
        />
      </div>:
      <input
        multiple={ true }
        onChange={ this.handleChange }
        type="file"
      />
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