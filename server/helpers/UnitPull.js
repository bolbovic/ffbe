const { Database } = require('../helpers/firebase.js');
const EventEmitter = require('events');

class UnitPull extends EventEmitter {
  constructor() {
    super();

    if (typeof UnitPull.__instance !== 'undefined') {
        throw new Error('UnitPull can only be instantiated once.');
    }

    UnitPull.__instance = this;

    Database.ref().child('units').once('value', (snap) => {
      this.units = snap.val();
      this.emit('done');
    });
  }

  add(obj) {
    //TODO
  }

  filterByColor(color) {
    return this.units.filter( unit => {
      return unit.color === color;
    });
  }
}

UnitPull.getInstance = () => {
  if (typeof instance == 'undefined') {
      return new UnitPull();
  }
  else {
      return instance;
  }
}

UnitPull.__instance = undefined;

module.exports = UnitPull;
