const Section = require('../Section.js');

class UnitSprites extends Section {
  getSection(doc) {
    let h2 = this.getElementById('Sprites', doc).parent;
    let h2Parent = h2.parent;
    return h2Parent.elements[h2Parent.elements.indexOf(h2)+1];
  }

  parse() {
    let s = this.section, obj = {}, rarities = [];

    s && s.elements[0].elements.forEach( (elem, idx) => {
      rarities.push(this.rarityParsing(elem.elements[0]));
    });
    s && s.elements[1].elements.forEach( (elem, idx) => {
      obj[rarities[idx]] = this.sectionToString(elem.elements[0]);
    });

    return obj;
  }
}

module.exports = UnitSprites;
