const Section = require('../Section.js');

class UnitMaxStat extends Section {
  getSection(doc) {
    let h2 = this.getElementById('Maximum_Stats_Increase', doc).parent;
    let h2Parent = h2.parent;
    return h2Parent.elements[h2Parent.elements.indexOf(h2)+1];
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
        obj.push(rarity);
      }
    });

    return obj;
  }
}

module.exports = UnitMaxStat;
