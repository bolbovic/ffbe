const Doc = require('../Doc.js');
const UnitInfos = require('../section/UnitInfos.js');
const UnitStats = require('../section/UnitStats.js');
const UnitMaxStat = require('../section/UnitMaxStat.js');
const UnitAbilities = require('../section/UnitAbilities.js');
const UnitMagics = require('../section/UnitMagics.js');

class Unit extends Doc {
  constructor(document) {
    let parsers = {};
    parsers.infos = new UnitInfos(document);
    parsers.stats = new UnitStats(document);
    parsers.maxStats = new UnitMaxStat(document);
    parsers.abilities = new UnitAbilities(document);
    parsers.magics = new UnitMagics(document);
    //parsers.push(new UnitSpells(document));

    super(document, parsers);
  }
}

module.exports = Unit;
