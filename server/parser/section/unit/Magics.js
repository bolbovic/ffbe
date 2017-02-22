const Section = require('./Section.js');

class UnitMagics extends Section {
  getSection(doc) {
    return this.getNextTableFromId('Magic', doc);
  }

  sToInt(s) {
    return parseInt(this.sectionToString(s)) || '-' ;
  }

  parse() {
    let s = this.section, magics = [], i = this.sToInt.bind(this);

    s && s.elements.forEach( (elem, idx) => {
      if ( elem.name === 'tr' && elem.elements[0].name === 'td') {
        let e = elem.elements, spell = {};
        spell.rarity = this.rarityParsing(e[0]);
        spell.lvl = i(e[1]);
        spell.img = this.sectionToString(e[2].elements[0]);
        spell.name = this.sectionToString(e[3].elements[0]);
        spell.desc = this.sectionToString(e[4]);
        spell.hits = i(e[5]);
        spell.mp = i(e[6]);
        magics.push(spell);
      }
    });

    return magics;
  }
}

module.exports = UnitMagics;
