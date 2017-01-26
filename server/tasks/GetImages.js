const Canvas = require('canvas'), Image = Canvas.Image;
const fs = require('fs');

const { saveUnits } = require('../helpers/DBSaver.js');
const Task = require('../tasks/Task.js');

const offsetX = 15;
const offsetY = 3;

const dame = require('../helpers/BadColors.js');

const toHex = (d, offset = 2) => {
  return ("00000000"+(Number(d).toString(16))).slice(-offset).toUpperCase();
};


class GetImages extends Task {
  constructor(node) {
    super(node, 'get-images');
    this.fileName = `./tmp/${this.node.id}.png`;
  }

  alreadyDone() {
    let bool = true;
    if ( this.node.units ) {
      this.node.units.forEach( unit => {
        if ( unit.image === undefined ) bool = false;
      })
    } else {
      bool = false;
    }
    return bool;
  }

  canBeLaunch() {
    return this.node.units !== undefined;
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

  saveCVToFile(fileName, canvas) {
    let data = canvas.toDataURL().replace(/^data:image\/\w+;base64,/, '');
    let buf = new Buffer(data, 'base64');
    fs.writeFile(fileName, buf);
  }

  start() {
    this.running();
    console.log(`Starting GetImages ${this.node.id}`);
    let img = new Image();
    img.onload = () => {
      let cv = new Canvas();
      cv.width = 20;
      cv.height = 20;

      // Save unit
      this.node.units.forEach( (unit, idx) => {
        cv.getContext('2d').drawImage(
          img, 
          unit.x - 10 + offsetX, unit.y - 45 + offsetY, cv.width, cv.height,
          0, 0, cv.width, cv.height
        );
        this.removeDameColors(cv, 20, 20);
        unit.image = cv.toDataURL();
        this.saveCVToFile(`./tmp/${this.node.id}-unit-${idx}.png`, cv);
      });

      // Save bigger unit
      cv.width = 40;
      cv.height = 40;
      this.node.units.forEach( (unit, idx) => {
        cv.getContext('2d').drawImage(
          img, 
          unit.x - 20 + offsetX, unit.y - 55 + offsetY, cv.width, cv.height,
          0, 0, cv.width, cv.height
        );
        this.removeDameColors(cv, 40, 40);
        this.saveCVToFile(`./tmp/${this.node.id}-whole-${idx}.png`, cv);
      });

      saveUnits(this.node.id, this.node.units);
      console.log(`Done with GetImages ${this.node.id}`);
      this.done();
    }
    img.src = this.fileName;
  }
}

module.exports = GetImages;
