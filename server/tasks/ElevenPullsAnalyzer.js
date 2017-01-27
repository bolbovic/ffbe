const Tasker = require('./Tasker.js');

const ComparePods = require('./ComparePods.js');
const DecodePods = require('./DecodePods.js');
const FindUnits = require('./FindUnits.js');
const Maximas = require('./Maximas.js');
const SaveTmpImage = require('./SaveTmpImage.js');
const CalculateSign = require('./CalcSign.js');

class ElevenPullsAnalyzer extends Tasker {
  constructor(node) {
    let tasks = [];
    tasks.push(new SaveTmpImage(node));
    tasks.push(new ComparePods(node, 'blue'));
    tasks.push(new ComparePods(node, 'gold'));
    tasks.push(new ComparePods(node, 'rainbow'));
    tasks.push(new Maximas(node, 'blue'));
    tasks.push(new Maximas(node, 'gold'));
    tasks.push(new Maximas(node, 'rainbow'));
    tasks.push(new DecodePods(node));
    tasks.push(new CalculateSign(node));
    tasks.push(new FindUnits(node));

    node.tasks = tasks.map( task => {
      return task.toDbStatus();
    });

    super(tasks, node);
  }
}

module.exports = ElevenPullsAnalyzer;
