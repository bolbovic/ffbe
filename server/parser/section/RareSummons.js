const Section = require('../Section.js');

class RareSummons extends Section {
  getSection(doc) {
    let span = this.getElementById('Rare_Summon', doc);
    if ( span ) {
      let h2 = span.parent;
      let h2Parent = h2.parent;
      return h2Parent.elements[h2Parent.elements.indexOf(h2)+1];
    } else {
      return null;
    }
  }

  sToInt(s) {
    return parseInt(this.sectionToString(s)) || '-' ;
  }

  parse() {
    let s = this.section, units = [], i = this.sToInt.bind(this);

    s && s.elements.forEach( (elem, idx) => {
      if ( elem.name === 'tr' && elem.elements[0].name === 'td') {
        let e = elem.elements, unit = {};
        unit.img = this.sectionToString(e[0].elements[0]);
        unit.name = this.sectionToString(e[1].elements[0]);
        unit.origin = this.sectionToString(e[2]);
        unit.role = this.sectionToString(e[3]);
        unit.minRarity = this.rarityParsing(e[4]);
        unit.maxRarity = this.rarityParsing(e[5]);
        unit.tmr = this.sectionToString(e[6].elements[0]);
        units.push(unit);
      }
    });

    return units;
  }
}

module.exports = RareSummons;
