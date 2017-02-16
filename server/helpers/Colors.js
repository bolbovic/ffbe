// Remove bad colors and 
const adaptSprite = (cv, width, height) => {
  let imageData = cv.getContext('2d').getImageData(0, 0, width, height);
  let p = imageData.data;
  for( let i = 0; i < p.length; i += 4) {
    let r = Math.floor(p[i]/16), g = Math.floor(p[i+1]/16), b = Math.floor(p[i+2]/16);
    let color = toHex(r, 1) + toHex(g, 1) + toHex(b, 1);
    if ( bad.indexOf(color) !== -1 ) {
      p[i + 0] = 0; // red
      p[i + 1] = 0; // green
      p[i + 2] = 0; // blue
      p[i + 3] = 0; // alpha
    } else {
      p[i + 0] = r*16; // red
      p[i + 1] = g*16; // green
      p[i + 2] = b*16; // blue
    }
  }
  cv.getContext('2d').putImageData(imageData, 0, 0);
}

const bad = require('../helpers/BadColors.js');

const offsetX = 15;
const offsetY = 3;

const toHex = (d, offset = 2, base = 16) => {
  return ("00000000"+(Number(d).toString(base))).slice(-offset).toUpperCase();
};

module.exports = {
  adaptSprite,
  bad,
  offsetX,
  offsetY,
  toHex
}
