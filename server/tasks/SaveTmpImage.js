const fs = require('fs');
const ImageDataURI = require('image-data-uri');

const Task = require('./Task.js');

class SaveTmpImage extends Task {
  constructor(node) {
    super(node, 'save-tmp');
    this.fileName = `./tmp/${this.node.id}.png`;
    this.tmpFileName = `./tmp/_${this.node.id}.png`;
    this.init();
  }

  alreadyDone() {
    return fs.existsSync(this.fileName);
  }

  canBeLaunch() {
    return this.node.src !== null;
  }

  start() {
    this.running();
    console.log(`Starting SaveTmpImage ${this.node.id}`);
    var data = this.node.src.replace(/^data:image\/\w+;base64,/, '');
    let buf = new Buffer(data, 'base64');
    fs.writeFile(this.tmpFileName, buf, (err) => {
      if (err) throw err;
      fs.renameSync(this.tmpFileName, this.fileName);
      console.log(`Done with SaveTmpImage ${this.node.id}`);
      this.done();
    });
  }
}

module.exports = SaveTmpImage;
