const Doc = require('../Doc.js');
const UnitInfos = require('../section/unit/Infos.js');
const UnitStats = require('../section/unit/Stats.js');
const UnitMaxStat = require('../section/unit/MaxStat.js');
const UnitAbilities = require('../section/unit/Abilities.js');
const UnitMagics = require('../section/unit/Magics.js');
const UnitSprites = require('../section/unit/Sprites.js');

class Unit extends Doc {
  constructor(document) {
    let parsers = {};
    parsers.infos = new UnitInfos(document);
    parsers.stats = new UnitStats(document);
    parsers.maxStats = new UnitMaxStat(document);
    parsers.abilities = new UnitAbilities(document);
    parsers.magics = new UnitMagics(document);
    parsers.sprites = new UnitSprites(document);

    super(document, parsers);
  }
}

module.exports = Unit;
