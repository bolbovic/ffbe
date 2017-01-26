const Canvas = require('canvas'), Image = Canvas.Image;
const fs = require('fs');
const orderBy = require('lodash').orderBy;

const units = [
  {
    "color" : "gold",
    "x" : 20,
    "y" : 286
  }, {
    "color" : "blue",
    "x" : 92,
    "y" : 286
  }, {
    "color" : "gold",
    "x" : 163,
    "y" : 286
  }, {
    "color" : "blue",
    "x" : 235,
    "y" : 286
  }, {
    "color" : "gold",
    "x" : 306,
    "y" : 286
  }, {
    "color" : "blue",
    "x" : 20,
    "y" : 396
  }, {
    "color" : "blue",
    "x" : 92,
    "y" : 396
  }, {
    "color" : "blue",
    "x" : 163,
    "y" : 396
  }, {
    "color" : "blue",
    "x" : 235,
    "y" : 396
  }, {
    "color" : "blue",
    "x" : 306,
    "y" : 396
  }, {
    "color" : "blue",
    "x" : 20,
    "y" : 507
  }
];
const offsetX = 15;
const offsetY = 3;

const id = '-KbEsYYprnioB2PWutpz';
const fileName = `./tmp/_${id}.png`;
const dame = require('./helpers/BadColors.js');

const toHex = (d, offset = 2) => {
  return ("00000000"+(Number(d).toString(16))).slice(-offset).toUpperCase();
};

const compareSign = (a, b) => {
  if ( a.sign.length > b.sign.length ) {
    return compareSign(b, a);
  } else {
    let score = 0, total = 0, ta = a.picWidth*a.picHeight, tb = b.picWidth*b.picHeight;
    for ( let i = 0; i < a.sign.length; i++ ) {
      let col = a.sign[i].color, fa = a.colors[col].times;
      //console.log('nia?', score, total);
      if ( b.colors[col] ) {
        let ra = fa / ta, rb = b.colors[col].times / tb, fb = fa * rb / ra;
        //console.log(col, ra, rb, fa, fb, ta, tb);
        score += Math.max(fa - Math.abs(fa - fb), 0);
      }
      total += fa;
      //console.log('score', score, total);
    }
    //console.log('total score', score, total);
    return score / total;
  }
};

let img = new Image();
img.onload = () => {
  let coef = img.width / 360;

  let cv = new Canvas();
  cv.width = 50 * coef;
  cv.height = 50 * coef;

  units.forEach( (unit, idx) => {
    unit.picWidth = cv.width;
    unit.picHeight = cv.height;
    //unit.x = unit.x * img.width / 360;
    //unit.y = unit.y * img.height / 360;

    cv.getContext('2d').drawImage(
      img,
      (unit.x - 25 + offsetX) * coef, (unit.y - 70 + offsetY) * coef, cv.width, cv.height,
      0, 0, cv.width, cv.height);
    //unit.image = cv.toDataURL();

    // UnitSignature
    let colors = {};
    let imageData = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height);
    let p = imageData.data;
    for( let i = 0; i < p.length; i += 4) {
      //let color = toHex(p[i+0]) + toHex(p[i+1]) + toHex(p[i+2]);
      let r = toHex(Math.floor(p[i]/16), 1),
        g = toHex(Math.floor(p[i+1]/16), 1),
        b = toHex(Math.floor(p[i+2]/16), 1);
      let color = r + g + b;

      if ( dame.indexOf(color) !== -1 ) {
        p[i + 0] = 0; // red
        p[i + 1] = 0; // green
        p[i + 2] = 0; // blue
        p[i + 3] = 255;
      } else {
        p[i + 0] = parseInt(r,16)*16; // red
        p[i + 1] = parseInt(g,16)*16; // green
        p[i + 2] = parseInt(b,16)*16; // blue
        if ( colors[color] ) {
          colors[color].times++;
        } else {
          colors[color] = {times: 1, color};
        }
      }
    }

    unit.sign = orderBy(colors, ['times'], ['desc']).filter( o => {
      return o.times > 36;
    });
    unit.colors = colors;

    cv.getContext('2d').putImageData(imageData, 0, 0);
    let data = cv.toDataURL().replace(/^data:image\/\w+;base64,/, '');
    let buf = new Buffer(data, 'base64');
    fs.writeFile(`./tmp/${id}-unit-${idx}.png`, buf);
  });

  // Calcul over
  console.log('compareSummaries for 1');
  let baseUnit = units[3];
  //console.log(baseUnit.sign);
  units.forEach( (unit, idx) => {
    let sum = compareSign(baseUnit, unit);
    console.log(`${idx} comparaison: ${sum}`);
    if ( sum > .7 ) {
      //console.log(unit.sign);
    }
  });

};
img.src = fileName;

