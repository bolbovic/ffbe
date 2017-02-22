const Canvas = require('canvas'), Image = Canvas.Image;
const EventEmitter = require('events');
const values = require('lodash').values;

const { adaptSprite, offsetX, offsetY } = require('../helpers/Colors.js');
const { Database } = require('../helpers/firebase.js');

const ENDPOINT = 'units';

class UnitPool extends EventEmitter {
  constructor() {
    super();

    if (typeof UnitPull.__instance !== 'undefined') {
        throw new Error('UnitPool can only be instantiated once.');
    }

    UnitPull.__instance = this;

    Database.ref().child(ENDPOINT).once('value', (snap) => {
      this.units = snap.val() || {};
      this.emit('done');
    });

    this._imgs = {};
  }

  getImage(baseUnit, imgId, id) {
    let ref = Database.ref().child(`${ENDPOINT}/${id}/image`);
    this._imgs[id] = new Image();
    let img = this._imgs[id];
    img.onload = () => {
      let coef = img.width / 360;

      let cv = new Canvas();
      cv.width = 50 * coef;
      cv.height = 50 * coef;

      // Save unit
      cv.getContext('2d').drawImage(
        img,
        (baseUnit.x - 25 + offsetX) * coef,
        (baseUnit.y - 70 + offsetY) * coef,
        cv.width,
        cv.height,
        0, 0, cv.width, cv.height
      );

      adaptSprite(cv, cv.width, cv.height);
      ref.set(cv.toDataURL());
      delete this._imgs[id];
    }
    img.src = `./tmp/${imgId}.png`;
  }

  add(unit, imgId) {
    //console.log('adding an unit...');
    let ref = Database.ref().child(ENDPOINT).push();
    //console.log(ref.key);
    let id = Object.keys(this.units).length;
    let newUnit = {
      color: unit.color,
      id,
      name: id,
      sign: unit.sign
    };
    ref.set(newUnit);
    this.units[ref.key] = newUnit;
    this.getImage(unit, imgId, ref.key);
    return id;
  }

  filterByColor(color) {
    return values(this.units).filter( unit => {
      return unit.color === color;
    });
  }
}

UnitPull.getInstance = () => {
  if (typeof UnitPull.__instance == 'undefined') {
      return new UnitPull();
  }
  else {
      return UnitPull.__instance;
  }
}

UnitPull.__instance = undefined;

module.exports = UnitPull;
