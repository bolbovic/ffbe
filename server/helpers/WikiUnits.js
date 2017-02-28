const EventEmitter = require('events');

const { Database } = require('../helpers/firebase.js');

const ENDPOINT = 'wiki/units';

class Unit {
  constructor(unit) {
    ['abilities', 'infos', 'magics', 'maxStats', 'sprites', 'stats'].forEach( param => {
      this[param] = unit[param] || {};
    });
    this._abilitiesByName = {};
    this._magicsByName = {};
    Object.keys(this.abilities).forEach( (id) => {
      this._abilitiesByName[this.abilities[id].name.toLowerCase()] = this.abilities[id];
    });
    Object.keys(this.magics).forEach( (id) => {
      this._magicsByName[this.magics[id].name.toLowerCase()] = this.magics[id];
    });
  }

  findAbility(name) {
    return this.formatAbility(this._abilitiesByName[name] || this._magicsByName[name]);
  }

  formatAbility(ab) {
    return ab ? `${ab.name} ( ${ab.rarity}*${ab.lvl}, ${ab.mp > 0 ? `${ab.mp} MP` : '-' }): ${ab.desc}` : null;
  }

  toString() {
    return `http://exvius.gamepedia.com/${this.infos.name}`;
  }
}

class WikiUnits extends EventEmitter {
  constructor() {
    super();

    if (typeof WikiUnits.__instance !== 'undefined') {
        throw new Error('WikiUnits can only be instantiated once.');
    }

    WikiUnits.__instance = this;

    this._unitsByName = {};
    Database.ref().child(ENDPOINT).once('value', (snap) => {
      this._units = snap.val() || {};
      Object.keys(this._units).forEach( (id) => {
        console.log(id, this._units[id].infos.name);
        this._unitsByName[this._units[id].infos.name] = new Unit(this._units[id]);
      });
      this.emit('done');
    });
  }

  getUnitByName(name) {
    return this._unitsByName[name] || null;
  }
}

WikiUnits.getInstance = () => {
  if (typeof WikiUnits.__instance == 'undefined') {
      return new WikiUnits();
  }
  else {
      return WikiUnits.__instance;
  }
}

WikiUnits.__instance = undefined;

module.exports = WikiUnits;
