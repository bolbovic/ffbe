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

const id = '-KbEg3fWhFmbVLbPBPLo';
const fileName = `./tmp/_${id}.png`;
const dame = require('./helpers/BadColors.js');

const toHex = (d, offset = 2) => {
  return ("00000000"+(Number(d).toString(16))).slice(-offset).toUpperCase();
};

const compareSign = (a, b) => {
  if ( a.sign.length > b.sign.length ) {
    return compareSign(b, a);
  } else {
    let score = 0, total = 0, ta = 400, tb = 400;
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
  /** 
    let cvBG = new Canvas();
    cvBG.width = 60;
    //cvBG.width = 800;
    cvBG.height = 100;
    //cvBG.height = 60;
    let x = 435, y = 800;
    //let x = 375, y = 1120;
    //let x = 200, y = 1320;
    cvBG.getContext('2d').drawImage(
      img,
      x, y, cvBG.width, cvBG.height,
      0, 0, cvBG.width, cvBG.height
    );
    /*****
    let data = cvBG.toDataURL().replace(/^data:image\/\w+;base64,/, '');
    let buf = new Buffer(data, 'base64');
    fs.writeFile(`./tmp/${id}-background-rainbow.png`, buf);
    //fs.writeFile(`./tmp/${id}-background-blue.png`, buf);
    //fs.writeFile(`./tmp/${id}-background-gold.png`, buf);
    //fs.writeFile(`./tmp/${id}-background.png`, buf);
    /*****

    let p = cvBG.getContext('2d').getImageData(0, 0, cvBG.width, cvBG.height).data, colors = {};
    for( let i = 0; i < p.length; i += 4) {
      //let color = ( (Math.floor(p[idx]/16) << 8) + (Math.floor(p[idx+1]/16) << 4) + Math.floor(p[idx+2]/16) ).toString(16);
      let r = Math.floor(p[i]/16), g = Math.floor(p[i+1]/16), b = Math.floor(p[i+2]/16)
      let color = toHex(r, 1) + toHex(g, 1) + toHex(b, 1);
      if (dame.indexOf(color) === -1 ) {
        colors[color] = colors[color] ? colors[color] + 1 : 1;
      }
    }
    console.log( Object.keys(colors).join('\',\'') );
    
    return;
  /*****/

  let dame256 = {}
  dame.forEach( c => {
    let newC = toHex(Math.floor(parseInt(c, 16)/16), 3);
    dame256[newC] = 1;
  });

  //console.log(Object.keys(dame256));
  let noWay = Object.keys(dame256);
  //return;

  let coef = img.height / 360;


  let cv = new Canvas();
  cv.width = 60 * coef;
  cv.height = 60 * coef;

  units.forEach( (unit, idx) => {

    //unit.x = unit.x * img.height / 360;
    //unit.y = unit.y * img.height / 360;

    cv.getContext('2d').drawImage(
      img,
      (unit.x - 10 + offsetX) * coef, (unit.y - 40 + offsetY) * coef, cv.width, cv.height,
      0, 0, cv.width, cv.height);
    //unit.image = cv.toDataURL();

    // UnitSignature
    let colors = {};
    let imageData = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height);
    let p = imageData.data;
    for( let i = 0; i < p.length; i += 4) {
      //let color = toHex(p[i+0]) + toHex(p[i+1]) + toHex(p[i+2]);
      let color = toHex(Math.floor(p[i]/16), 1)
        + toHex(Math.floor(p[i+1]/16), 1)
        + toHex(Math.floor(p[i+2]/16), 1)

      if ( noWay.indexOf(color) !== -1 ) {
        p[i + 0] = 0; // red
        p[i + 1] = 0; // green
        p[i + 2] = 0; // blue
        p[i + 3] = 0;
      } else {
        if ( colors[color] ) {
          colors[color].times++;
        } else {
          colors[color] = {times: 1, color};
        }
      }
    }

    unit.sign = orderBy(colors, ['times'], ['desc']).filter( o => {
      return o.times > 5;
    });
    unit.colors = colors;

    cv.getContext('2d').putImageData(imageData, 0, 0);
    let data = cv.toDataURL().replace(/^data:image\/\w+;base64,/, '');
    let buf = new Buffer(data, 'base64');
    fs.writeFile(`./tmp/${id}-unit-${idx}.png`, buf);
  });

  // Calcul over
  console.log('compareSummaries for 1');
  let baseUnit = units[1];
  console.log(baseUnit);
  units.forEach( (unit, idx) => {
    let sum = compareSign(baseUnit, unit);
    console.log(`${idx} comparaison: ${sum}`);
    if ( sum > .5 ) {

    }
  });

};
img.src = fileName;

