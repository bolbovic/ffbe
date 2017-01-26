const fs = require('fs'),
      ImageDataURI = require('image-data-uri'),
      http = require('http'),
      Stream = require('stream').Transform,
      Canvas = require('canvas'),
      Image = Canvas.Image;

const Task = require('./Task.js');

class SaveTmpImage extends Task {
  constructor(node) {
    super(node, 'save-tmp');
    this.fileName = `./tmp/${this.node.id}.png`;
    this.tmpFileName = `./tmp/_${this.node.id}.png`;
    console.log(this.tmpFileName);
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
    //var data = this.node.src.replace(/^data:image\/\w+;base64,/, '');
    let { fileName, tmpFileName } = this;
    http.request(this.node.cloudinary.url, (response) => {
      var data = new Stream();
      response.on('data', (chunk) => {
        data.push(chunk);
      });
      response.on('end', () => {
        fs.writeFileSync(tmpFileName, data.read());
        let img = new Image();
        img.onload = (evt) => {
          let cv = new Canvas();
          cv.width = 360;
          cv.height = img.height * 360 / img.width;
          cv.getContext('2d').drawImage(
            img,
            0, 0, img.width, img.height,
            0, 0, cv.width, cv.height
          );

          let data = cv.toDataURL().replace(/^data:image\/\w+;base64,/, '');
          let buf = new Buffer(data, 'base64');
          fs.writeFileSync(fileName, buf);
          this.done();
        }
        img.src = tmpFileName;
      });
    }).end();
  }
}

module.exports = SaveTmpImage;
