const Section = require('./Section.js');

class UnitStats extends Section {
  getSection(doc) {
    return this.getNextTableFromId('Stats', doc);
  }

  sToInt(s) {
    return parseInt(this.sectionToString(s));
  }

  parse() {
    let s = this.section, obj = [], i = this.sToInt.bind(this);

    s.elements.forEach( (elem, idx) => {
      if ( elem.name === 'tr' && elem.elements[0].name === 'td') {
        let e = elem.elements, rarity = {};
        rarity.rarity = this.rarityParsing(e[0]);
        rarity.hp = i(e[1]);
        rarity.mp = i(e[2]);
        rarity.atk = i(e[3]);
        rarity.def = i(e[4]);
        rarity.mag = i(e[5]);
        rarity.spr = i(e[6]);
        rarity.aah = i(e[7]);
        rarity.dc = i(e[8]);
        rarity.expGrowthPattern = i(e[9]);
        obj.push(rarity);
      }
    });

    return obj;
  }
}

module.exports = UnitStats;
