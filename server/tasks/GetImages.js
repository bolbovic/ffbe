const Canvas = require('canvas'), Image = Canvas.Image;
const fs = require('fs');

const { saveUnits } = require('../helpers/DBSaver.js');
const Task = require('../tasks/Task.js');

const offsetX = 15;
const offsetY = 3;

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

  start() {
    this.running();
    console.log(`Starting GetImages ${this.node.id}`);
    let img = new Image();
    img.onload = () => {
      let cv = new Canvas();
      cv.width = 20;
      cv.height = 20;
      this.node.units.forEach( (unit, idx) => {
        cv.getContext('2d').drawImage(
          img, 
          unit.x - 10 + offsetX, unit.y - 40 + offsetY, cv.width, cv.height,
          0, 0, cv.width, cv.height
        );
        unit.image = cv.toDataURL();

        let data = unit.image.replace(/^data:image\/\w+;base64,/, '');
        let buf = new Buffer(data, 'base64');
        fs.writeFile(`./tmp/${this.node.id}-unit-${idx}.png`, buf);

      });
      saveUnits(this.node.id, this.node.units);
      console.log(`Done with GetImages ${this.node.id}`);
      this.done();
    }
    img.src = this.fileName;
  }
}

module.exports = GetImages;
