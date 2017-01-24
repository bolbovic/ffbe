const fs = require('fs');
const exec = require('child_process').exec;

const DBSaver = require('../helpers/DBSaver.js');
const Task = require('../tasks/Task.js');

class Maximas extends Task {
  constructor(node, podColor = 'blue') {
    super(node, `maxima-${podColor}`);
    this.color = podColor;
    this.filePrefix = `./tmp/${this.node.id}`;
    this.compareFile = `${this.filePrefix}-${this.color}-result-1.png`;
    this.maximasFile = `${this.filePrefix}-${this.color}-result-maxima.png`;
  }

  alreadyDone() {
    return fs.existsSync(this.maximasFile);
  }

  canBeLaunch() {
    return fs.existsSync(this.compareFile);
  }

  start() {
    // Something Something
    this.running();
    console.log(`Starting Maximas ${this.color} ${this.node.id}`);
    let cmd = './scripts/maxima -n 11 -t 90';
    exec(`${cmd} ${this.compareFile} ${this.maximasFile}`,
      (err, stdout, stderr) => {
        if ( !err ) {
          let lines = stdout.split('\n'), pods = [];
          lines.forEach( line => {
            if ( line !== '' ) {
              let [coord, gray] = line.split(' ');
              let [x, y] = coord.split(',');
              let [a,b,percent] = gray.split(',');
              pods.push({x, y, percent});
            }
          });
          if ( this.node.pods === undefined ) this.node.pods = {};
          this.node.pods[this.color] = pods;
          DBSaver.savePods(this.node.id, this.color, pods);
          console.log(`Done with Maximas ${this.color} ${this.node.id}`);
          this.done();
        } else {
          console.log('ERROR');
          console.log(err);
          this.error(err);
        }
      }
    )
  }
}

module.exports = Maximas;
