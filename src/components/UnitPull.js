import React from 'react';
import { DatabaseRef } from '../config/Firebase';
import { values } from 'lodash';

const Unit = (props) => {
  let { color, image, name } = props.data;
  return (
    <div className="unit">
      <img alt={ color } className={ `color-${color}` } src={ image } />
      <div className="name">{ name !== undefined ? name : '???' }</div>
    </div>
  );
};

class UnitPull extends React.Component {
  constructor(props: Props) {
    super(props);
    this.state = {
      units: {}
    };
    this.db = DatabaseRef.child('units');
  }

  newUpload = (snap) => {
    let { units } = this.state;
    units[snap.key] = snap.val();
    this.setState({units});
  }

  componentWillMount() {
    this.db.on('child_added', this.newUpload);
    this.db.on('child_changed', this.newUpload);
  }

  componentWillUnmount() {
    this.db.off('child_added', this.newUpload);
    this.db.off('child_changed', this.newUpload);
  }

  renderGroup(color, array) {
    return (
      <div key={ color } className={ `group group-${color}` }>
        { array.map( unit => {
          return unit ? <Unit data={ unit } key={ `${unit.id}` } /> : null;
        })}
      </div>
    );
  }

  render() {
    return (
      <div className="unit-pull" id={this.me}>
        { ['rainbow', 'gold', 'blue'].map( color => {
            return this.renderGroup( color, values(this.state.units).filter( unit => {
              return unit.color === color;
            }) );
        }) }
        <div className="clear" />
      </div>
    );
  }
  /* End React Component LifeCycle Methods */
}

export default UnitPull;

//Unit test entry point
export const _UnitPull = UnitPull;
