const fs = require('fs'),
      ImageDataURI = require('image-data-uri'),
      http = require('http'),
      Stream = require('stream').Transform,
      Canvas = require('canvas'),
      Image = Canvas.Image,
      orderBy = require('lodash').orderBy;

const BadColors = require('../helpers/BadColors.js');
const { saveUnits } = require('../helpers/DBSaver.js');
const Task = require('./Task.js');

const offsetX = 15;
const offsetY = 3;

// to put in a helper later...
const toHex = (d, offset = 2) => {
  return ("00000000"+(Number(d).toString(16))).slice(-offset).toUpperCase();
};



class CalcSign extends Task {
  constructor(node) {
    super(node, 'calc-sign');
    this.fileName = `./tmp/${this.node.id}.png`;
    this.rawFileName = `./tmp/_${this.node.id}.png`;
    this.init();
  }

  alreadyDone() {
    let bool = true;
    if ( this.node.units ) {
      this.node.units.forEach( unit => {
        if ( unit.sign === undefined ) bool = false;
      })
    } else {
      bool = false;
    }
    return bool;
  }

  canBeLaunch() {
    let bool = true;
    if ( this.node.units ) {
      this.node.units.forEach( unit => {
        if ( unit.image === undefined ) bool = false;
      })
    } else {
      bool = false;
    }
    return fs.existsSync(this.rawFileName) && bool;
  }

  colorToHex(color) {
    return toHex(Math.floor(color/16), 1)
  }

  start() {
    this.running();
    console.log(`Starting CalcSign ${this.node.id}`);
    //var data = this.node.src.replace(/^data:image\/\w+;base64,/, '');
    let img = new Image();
    img.onload = () => {
      // We use the raw version instead of smaller one because more precise
      let coef = img.width / 360;

      let cv = new Canvas();
      cv.width = 50 * coef;
      cv.height = 50 * coef;

      this.node.units.forEach( (unit, idx) => {
        unit.sign = {};

        // Save for later use
        unit.sign.picWidth = cv.width;
        unit.sign.picHeight = cv.height;

        cv.getContext('2d').drawImage(
          img,
          (unit.x - 25 + offsetX) * coef, (unit.y - 70 + offsetY) * coef, cv.width, cv.height,
          0, 0, cv.width, cv.height
        );

        // UnitSignature
        let colors = {};
        let imageData = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height);
        let p = imageData.data;
        for( let i = 0; i < p.length; i += 4) {
          let r = this.colorToHex(p[i]), g = this.colorToHex(p[i+1]), b = this.colorToHex(p[i+2]);
          let color = r + g + b;

          if ( BadColors.indexOf(color) === -1 ) {
            if ( colors[color] ) {
              colors[color].times++;
            } else {
              colors[color] = {times: 1, color};
            }
          }

          // debug mode... no need in the end
          if ( BadColors.indexOf(color) !== -1 ) {
            p[i + 0] = 0; // red
            p[i + 1] = 0; // green
            p[i + 2] = 0; // blue
            p[i + 3] = 255;
          } else {
            p[i + 0] = parseInt(r,16)*16; // red
            p[i + 1] = parseInt(g,16)*16; // green
            p[i + 2] = parseInt(b,16)*16; // blue
          }
        }

        unit.sign.signature = orderBy(colors, ['times'], ['desc']).filter( o => {
          return o.times > (unit.sign.picWidth * unit.sign.picHeight / 1000);
        });
        unit.sign.colors = colors;


        // debug mode but need to remove that later
        cv.getContext('2d').putImageData(imageData, 0, 0);
        let data = cv.toDataURL().replace(/^data:image\/\w+;base64,/, '');
        let buf = new Buffer(data, 'base64');
        fs.writeFile(`./tmp/${this.node.id}-unit-${idx}.png`, buf);
      });
      saveUnits(this.node.id, this.node.units);
      console.log(`Done with CalcSign ${this.node.id}`);
      this.done();
    };
    img.src = this.rawFileName;
  }
}

module.exports = CalcSign;
