const fs = require('fs');
const exec = require('child_process').exec;

const Task = require('../tasks/Task.js');

class ComparePods extends Task {
  constructor(node, podColor = 'blue') {
    super(node, `pod-${podColor}`);
    this.color = podColor;
    this.filePrefix = `./tmp/${this.node.id}`;
    this.init();
  }

  alreadyDone() {
    return fs.existsSync(`${this.filePrefix}-${this.color}-result-0.png`);
  }

  canBeLaunch() {
    return fs.existsSync(`${this.filePrefix}.png`);
  }

  start() {
    // Something Something
    this.running();
    console.log(`Starting ComparePods ${this.color} ${this.node.id}`);
    let cmd = 'compare -metric rmse -subimage-search';
    let colorFile = `./img/podiums/${this.color}.png`;
    let compareResultFile = `${this.filePrefix}-${this.color}-result.png`;
    exec(`${cmd} ${this.filePrefix}.png ${colorFile} ${compareResultFile}`,
      (err, stdout, stderr) => {
        if ( err.code !== 1 ) {
          console.log('ERROR');
          console.log(err);
          this.error(err);
          return;
        } else {
          console.log(`Done with ComparePods ${this.color} ${this.node.id}`);
          this.done();
        }
      }
    )
  }
}

module.exports = ComparePods;
