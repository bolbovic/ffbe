const fs = require('fs');

const lineIsEmpty = (data, width, height, y) => {
  let bool = true;
  //console.log(y, width, height, data.length, data.length / 4, data.length / (4*width));
  for (let i = 0; i < width && bool; i++) {
    if (data[(y*width+i)*4+3]){
    //  console.log(i, y, data[(y*height+i)*4+3]);
      bool = false;
    }
  }
  return bool;
}

const columnIsEmpty = (data, width, height, x) => {
  let bool = true;
  for (let i = 0; i < height && bool; i++) {
    if (data[(i*width+x)*4+3]){
      bool = false;
    }
  }
  return bool;
}

const calcCroppedCoord = (d, w, h) => {
  let x = 0, y = 0, width = w, height = h;

  /* Draw a picture of shades of the char to debug lineIsEmpty
  for (let j = 0; j < h; j++) {
    let str = '';
    for (let i = 0; i < w; i++) {
      str += d[(j*w+i)*4+3] ? '0' : ' ';
    }
    console.log(str, lineIsEmpty(d, w, h, j));
  }
  */

  // Top part
  for( let i = 0; i < h && lineIsEmpty(d, w, h, i); i++, x = i, height = h - x);

  // Bottom part
  for( let i = h - 1; i > x && lineIsEmpty(d, w, h, i); i--, height = i - x + 1);

  // Left part
  for( let i = 0; i < w && columnIsEmpty(d, w, h, i); i++, y = i, width = i - y);

  // Right part
  for( let i = w -1; i > y && columnIsEmpty(d, w, h, i); i--, width = i - y + 1);

  return {x, y, width, height};
}

const cvToDisk = (cv, fileName) => {
  let data = cv.toDataURL().replace(/^data:image\/\w+;base64,/, '');
  let buf = new Buffer(data, 'base64');
  fs.writeFileSync(fileName, buf);
}

module.exports = {
  calcCroppedCoord,
  cvToDisk,
};
