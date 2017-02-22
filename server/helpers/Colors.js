const orderBy = require('lodash').orderBy;

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

const compareSign = (a, b, scoreOnly = false, force = false) => {
  if ( a.signature.length > b.signature.length && !force ) {
    return compareSign(b, a);
  } else {
    let notFound = 0, score = 0, total = 0,
      ta = a.picWidth * a.picHeight, tb = b.picWidth * b.picHeight;
    for ( let i = 0; i < a.signature.length; i++ ) {
      let col = a.signature[i].color, fa = a.colors[col].times;
      //console.log('nia?', score, total);
      if ( b.colors[col] ) {
        let ra = fa / ta, rb = b.colors[col].times / tb, fb = fa * rb / ra;
        //console.log(col, ra, rb, fa, fb, ta, tb);
        score += Math.max(fa - Math.abs(fa - fb), 0);
      } else {
        notFound++;
      }
      total += fa;
      //console.log('score', score, total);
    }
    //console.log('total score', score, total);
    let result = score / total;
    if ( scoreOnly === false ) {
      let nbColors = a.signature.length;
      result = (
        (score / total) + 
        compareSign(b, a, true, true)
        /*+
        ((nbColors - notFound) / nbColors) +
        (b.signature.length / nbColors)*/
      ) / 2;
    }
    return result;
  }
};

const offsetX = 15;
const offsetY = 3;

const colorToHex = (color) => {
  return toHex(Math.floor(color/16), 1)
};

const signature = (imageData, bad = ['000']) => {
  let p = imageData.data, colors = {}, totPix = 0, sign = {};
  let linesWeight = new Array(imageData.height);
  linesWeight.fill(0);
  for( let i = 0; i < p.length; i += 4) {
    let r = colorToHex(p[i]), g = colorToHex(p[i+1]), b = colorToHex(p[i+2]);
    let color = r + g + b;

    if ( bad.indexOf(color) === -1 ) {
      if ( colors[color] ) {
        colors[color].times++;
      } else {
        colors[color] = {times: 1, color};
      }
      totPix++;
    }

    linesWeight[Math.floor(i/4/imageData.width)] += p[i+3] ? 1 : 0;
  }

  sign.signature = orderBy(colors, ['times'], ['desc']).filter( o => {
    return o.times > 10;
  });
  sign.colors = colors;
  sign.unitSurface = totPix;
  sign.height = imageData.height;
  sign.width = imageData.width;
  sign.linesWeight = linesWeight;

  return sign
};

const toHex = (d, offset = 2, base = 16) => {
  return ("00000000"+(Number(d).toString(base))).slice(-offset).toUpperCase();
};

module.exports = {
  adaptSprite,
  bad,
  compareSign,
  offsetX,
  offsetY,
  signature,
  toHex
}
