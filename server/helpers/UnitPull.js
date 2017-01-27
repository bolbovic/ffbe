const Canvas = require('canvas'), Image = Canvas.Image;
const EventEmitter = require('events');
const values = require('lodash').values;

const dame = require('../helpers/BadColors.js');
const { Database } = require('../helpers/firebase.js');

const offsetX = 15;
const offsetY = 3;

// to put in a helper later...
const toHex = (d, offset = 2) => {
  return ("00000000"+(Number(d).toString(16))).slice(-offset).toUpperCase();
};

class UnitPull extends EventEmitter {
  constructor() {
    super();

    if (typeof UnitPull.__instance !== 'undefined') {
        throw new Error('UnitPull can only be instantiated once.');
    }

    UnitPull.__instance = this;

    Database.ref().child('units').once('value', (snap) => {
      this.units = snap.val() || {};
      this.emit('done');
    });

    this._imgs = {};
  }

  removeDameColors(cv, width, height) {
    let imageData = cv.getContext('2d').getImageData(0, 0, width, height);
    let p = imageData.data;
    for( let i = 0; i < p.length; i += 4) {
      //let color = toHex(p[i+0]) + toHex(p[i+1]) + toHex(p[i+2]);
      let r = Math.floor(p[i]/16), g = Math.floor(p[i+1]/16), b = Math.floor(p[i+2]/16);
      let color = toHex(r, 1) + toHex(g, 1) + toHex(b, 1);
      if ( dame.indexOf(color) !== -1 ) {
        p[i + 0] = 0; // red
        p[i + 1] = 0; // green
        p[i + 2] = 0; // blue
        p[i + 3] = 255; // alpha
      } else {
        p[i + 0] = r*16; // red
        p[i + 1] = g*16; // green
        p[i + 2] = b*16; // blue
      }
    }
    cv.getContext('2d').putImageData(imageData, 0, 0);
  }

  getImage(baseUnit, imgId, id) {
    let ref = Database.ref().child(`units/${id}/image`);
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
        (baseUnit.x - 25 + offsetX) * coef, (baseUnit.y - 70 + offsetY) * coef, cv.width, cv.height,
        0, 0, cv.width, cv.height
      );

      this.removeDameColors(cv, cv.width, cv.height);
      ref.set(cv.toDataURL());
      delete this._imgs[id];
    }
    img.src = `./tmp/${imgId}.png`;
  }

  add(unit, imgId) {
    //console.log('adding an unit...');
    let ref = Database.ref().child('units').push();
    //console.log(ref.key);
    let newUnit = {
      color: unit.color,
      id: ref.key,
      name: 'John Doe',
      sign: unit.sign
    };
    ref.set(newUnit);
    this.units[ref.key] = newUnit;
    this.getImage(unit, imgId, ref.key);
    return ref.key;
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
