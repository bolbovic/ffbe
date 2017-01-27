import React from 'react';
import { DatabaseRef } from '../config/Firebase';

import './UploadList.css';

const TaskStatus = (props) => {
  let { name, status } = props;
  return (
    <div className="task-status">
      <div className={ `status status-${status}` }>{ name }</div>
    </div>
  );
};

const TaskList = (props) => {
  let d = props.data;
  return (
    <div className="task-list">
      { ['save-tmp', 'pod-blue', 'pod-gold', 'pod-rainbow', 
         'maxima-blue', 'maxima-gold', 'maxima-rainbow',
         'decode-pods', 'calc-sign', 'find-units'].map( task => {
        return <TaskStatus key={ task } name={ task } status={ d[task] } />;
      })}
    </div>
  );
};

const Unit = (props) => {
  let { color, image, name } = props.data;
  return (
    <div className="unit">
      <img alt={ color } className={ `color-${color}` } src={ image } />
      <div className="name">{ name ? name : '???' }</div>
    </div>
  );
};

const UnitList = (props) => {
  let d = props.data;
  return (
    <div className="unit-list">
      { d.map( (unit, idx) => {
        return <Unit data={ unit } key={ idx }/>;
      })}
    </div>
  );
};

const Upload = (props) => {
  let d = props.data;
  return (
    <div className="upload">
      <div className="img"><img alt={ d.id } src={ d.cloudinary.url } /></div>
      <div className="infos">
        { d.tasksStatus ? <TaskList data={ d.tasksStatus } /> : null }
        { d.units ? <UnitList data={ d.units } /> : null }
      </div>
    </div>
  );
};

class UploadList extends React.Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      uploads: {}
    };
    this.db = DatabaseRef.child('uploads').orderByChild('type').equalTo('11pull');
  }

  newUpload = (snap) => {
    let { uploads } = this.state;
    uploads[snap.key] = snap.val();
    this.setState({uploads});
  }

  componentWillMount() {
    this.db.on('child_added', this.newUpload);
    this.db.on('child_changed', this.newUpload);
  }

  componentWillUnmount() {
    this.db.off('child_added', this.newUpload);
    this.db.off('child_changed', this.newUpload);
  }

  render() {
    return (
      <div className="upload-list" id={this.me}>
        { Object.keys(this.state.uploads).map( up => {
          return <Upload data={ this.state.uploads[up] } key={ this.state.uploads[up].id } />
        }) }
      </div>
    );
  }
  /* End React Component LifeCycle Methods */
}

export default UploadList;

//Unit test entry point
export const _UploadList  = UploadList;