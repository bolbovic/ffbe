const { Database } = require('../helpers/firebase.js');

class UnitSaver {
  constructor(unit) {
    this.data = unit;
    this.ref = Database.ref().child('wiki/units').child(this.data.infos.ids[0]);
  }

  save() {
    this.ref.set(this.data);
  }
}

module.exports = UnitSaver;