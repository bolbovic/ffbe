const Doc = require('../Doc.js');
const RareSummons = require('../section/RareSummons.js');

class UnitList extends Doc {
  constructor(document) {
    let parsers = {};
    parsers.rares = new RareSummons(document);

    super(document, parsers);
  }
}

module.exports = UnitList;
