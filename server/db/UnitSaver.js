const { Database } = require('../helpers/firebase.js');
const Canvas = require('canvas'),
      fs = require('fs'),
      Image = Canvas.Image,
      http = require('http'),
      Stream = require('stream').Transform,
      {adaptSprite, signature} = require('../helpers/Colors.js'),
      {calcCroppedCoord, cvToDisk} = require('../helpers/Image.js');

class UnitSaver {
  constructor(unit) {
    this.data = unit;
    this.ref = Database.ref().child('wiki/units').child(this.data.infos.ids[0]);
  }

  save() {
    // Save first part of data
    this.ref.set(this.data);

    // Calculate signs for imgs
    let file = this.data.sprites[this.data.infos.rarity[0]].replace('https:', 'http:');
    http.request(file, (response) => {
      var data = new Stream();
      response.on('data', (chunk) => {
        data.push(chunk);
      });
      response.on('end', () => {
        let tmpFileName = `./tmp/${this.data.infos.ids[0]}.png`;
        fs.writeFileSync(tmpFileName, data.read());
        let img = new Image();
        img.onload = () => {
          // First we need to remove the `bad colors` from the image
          // We don't want those to be in the cropped image
          let cv = new Canvas();
          cv.width = img.width;
          cv.height = img.height;
          cv.getContext('2d').drawImage(img, 0, 0);
          adaptSprite(cv, cv.width, cv.height);
          //cvToDisk(cv, `./tmp/${this.data.infos.ids[0]}-adapted.png`);

          // Then we crop the image
          let coord = calcCroppedCoord(
            cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data,
            cv.width, cv.height
          );
          let croppedCV = new Canvas();
          croppedCV.width = coord.width;
          croppedCV.height = coord.height;
          croppedCV.getContext('2d').drawImage(cv,
            coord.x, coord.y, coord.width, coord.height, 
            0, 0, coord.width, coord.height
          );
          cvToDisk(croppedCV, `./tmp/${this.data.infos.ids[0]}-cropped.png`);
          // Then we calculate the signature
          let imgD = croppedCV.getContext('2d').getImageData(0, 0, coord.width, coord.height);
          let sign = signature(imgD);
          this.ref.update({sign});
        };
        img.src = tmpFileName;
      });
    }).end();
  }
}

module.exports = UnitSaver;