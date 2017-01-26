import React from 'react';
import { UploadCore, Events } from 'uxcore-uploadcore';

class Uploader extends React.Component {
  componentDidMount() {
    let defaultConf = {
      request: {
        name: 'file',
        headers: null,
        withCredentials: false,
        timeout: 0,
        chunkEnable: false
      },
      processThreads: 1,
      autoPending: true,
      queueCapcity: 0,
      multiple: false,
      accept: null,
      sizeLimit: '1g',
      preventDuplicate: false
    };

    this.up = new UploadCore( Object.assign({}, defaultConf, this.props.uploadConf) );

    this.picker  = this.up.getPickerCollector();

    this.picker.addArea( this.refs.uploadArea );

    this.up.on(Events.FILE_UPLOAD_COMPLETED, (file) => {
      this.props.uploadComplete(file);
    });

    this.up.on(Events.FILE_UPLOAD_PROGRESS, (file, progress) => {
      this.props.uploadProgress(progress.percentage);
    });

    this.up.on(Events.FILE_UPLOAD_ERROR, (file, error) => {
      this.props.uploadError('An error occured while uploading the file please try again later');
      throw new Error(error);
    });

  }

  render() {
    return (
      <div className="uploader" style={{position: 'relative'}} ref="uploadArea">
        { this.props.children }
      </div>
    );
  }
}
Uploader.propTypes = {
  children: React.PropTypes.any,
  uploadComplete: React.PropTypes.func.isRequired,
  uploadConf: React.PropTypes.object.isRequired,
  uploadError: React.PropTypes.func.isRequired,
  uploadPreparing: React.PropTypes.func.isRequired,
  uploadProgress: React.PropTypes.func.isRequired
};
Uploader.defaultProps = {
  uploadError: () => {}
};

export default Uploader;
