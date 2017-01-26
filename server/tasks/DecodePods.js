const { sortBy } = require('lodash');

const Task = require('../tasks/Task.js');
const { saveUnits } = require('../helpers/DBSaver.js');

class DecodePods extends Task {
  constructor(node) {
    super(node, 'decode-pods');
  }

  alreadyDone() {
    return this.node.units !== undefined;
  }

  canBeLaunch() {
    return this.node.pods !== undefined && 
      this.node.pods.blue !== undefined &&
      this.node.pods.gold !== undefined &&
      this.node.pods.rainbow !== undefined;
  }

  start() {
    this.running();
    console.log(`Starting DecodePods ${this.node.id}`);
    let units = [];
    Object.keys(this.node.pods).forEach( color => {
      let cPods = this.node.pods[color];
      cPods.forEach( pod => {
        if ( parseInt(pod.percent) > 89 ) {
          let x = parseInt(pod.x), y = parseInt(pod.y);
          units.push({color, x, y});
        }
      });
    });
    units = sortBy(units, ['y', 'x']);
    // More checking could be done...
    this.node.units = units;
    saveUnits(this.node.id, units);
    console.log(`Done with DecodePods ${this.node.id}`);
    this.done();
  }
}

module.exports = DecodePods;
