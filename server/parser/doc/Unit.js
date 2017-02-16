const Doc = require('../Doc.js');
const UnitStats = require('../section/UnitStats.js');

class Unit extends Doc {
  constructor(document) {
    let parsers = [];
    parsers.push(new UnitStats(document));

    super(document, parsers);
  }
}

module.exports = Unit;
