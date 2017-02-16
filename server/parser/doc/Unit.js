const Doc = require('../Doc.js');
const UnitInfos = require('../section/UnitInfos.js');
const UnitStats = require('../section/UnitInfos.js');
const UnitSpells = require('../section/UnitInfos.js');

class Unit extends Doc {
  constructor(document) {
    let parsers = [];
    parsers.push(new UnitInfos(document));
    parsers.push(new UnitStats(document));
    parsers.push(new UnitSpells(document));

    super(document, parsers);
  }
}

module.exports = Unit;
