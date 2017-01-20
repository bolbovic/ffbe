const Task = require('../tasks/Task.js');
const { saveUnits } = require('../helpers/DBSaver.js');
const Canvas = require('canvas'), Image = Canvas.Image;

class GetImages extends Task {
  constructor(node) {
    super(node, 'get-images');
    this.fileName = `./tmp/${this.node.id}.png`;
  }

  alreadyDone() {
    let bool = true;
    this.node.units.forEach( unit => {
      if ( unit.image === undefined ) bool = false;
    })
    return bool;
  }

  canBeLaunch() {
    return this.node.units !== undefined;
  }

  start() {
    this.running();
    console.log(`Starting GetImages ${this.node.id}`);
    let img = new Image();
    img.onload = (evt) => {
      let cv = new Canvas();
      cv.width = 60;
      cv.height = 80;
      this.node.units.forEach( unit => {
        cv.getContext('2d').drawImage(img, unit.x - 30, unit.y - 80);
        unit.image = cv.toDataURL();
      });
      saveUnits(this.node.id, this.node.units);
      console.log(`Done with GetImages ${this.node.id}`);
      this.done();
    }
    img.src = this.fileName;
  }
}

module.exports = GetImages;
