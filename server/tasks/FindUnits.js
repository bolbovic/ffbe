const Task = require('../tasks/Task.js');
const ul = require('../helpers/UnitPull.js').getInstance();
const sync = require('synchronize');
//const exec = require('child_process').execFile;
//execSync = sync(exec);
const { saveUnits } = require('../helpers/DBSaver.js');

const compareSign = (a, b) => {
  if ( a.signature.length > b.signature.length ) {
    return compareSign(b, a);
  } else {
    let score = 0, total = 0, ta = a.picWidth * a.picHeight, tb = b.picWidth * b.picHeight;
    for ( let i = 0; i < a.signature.length; i++ ) {
      let col = a.signature[i].color, fa = a.colors[col].times;
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


class FindUnits extends Task {
  constructor(node) {
    super(node, 'find-units');
  }

  alreadyDone() {
    let bool = true;
    if ( this.node.units ) {
      this.node.units.forEach( unit => {
        if ( unit.unitId === undefined ) bool = false;
      })
    } else {
      bool = false;
    }
    return false && bool;
  }

  canBeLaunch() {
    let bool = true;
    if ( this.node.units ) {
      this.node.units.forEach( unit => {
        if ( unit.sign === undefined ) bool = false;
      })
    } else {
      bool = false;
    }
    return true && bool;
  }

  findUnit(unit) {
    let bestSum = 0, bestUnit = null, pool = ul.filterByColor(unit.color);
    //console.log(unit.id);
    //console.log(pool.length);
    for ( let i = 0, notFound = true; i < pool.length && notFound; i++ ) {
      let sum = compareSign(unit.sign, pool[i].sign);
      if ( sum > bestSum ) {
        bestSum = sum;
        bestUnit = pool[i];
        if ( bestSum > 0.7 ) {
          // it's probably the good one
          console.log('found it!');
          break;
        }
      }
    }
    //console.log(bestSum);
    //console.log(bestUnit && bestUnit.name);
    if ( bestSum > 0.7 ) {
      unit.unitId = bestUnit.id;
      unit.similarities = bestSum;
    } else {
      if ( bestSum > 0.5 ) {
        unit.possibleUnitId = bestUnit.id;
        unit.similarities = bestSum;
      } else {
        unit.unitId = ul.add(unit, this.node.id);
        unit.similarities = 1;
      }
    }
  }

  start() {
    this.running();
    console.log(`Starting FindUnits ${this.node.id}`);
    this.node.units.forEach( unit => {
      this.findUnit(unit);
    });
    saveUnits(this.node.id, this.node.units);
    console.log(`Done with FindUnits ${this.node.id}`);
    this.done();
  }
}

module.exports = FindUnits;
