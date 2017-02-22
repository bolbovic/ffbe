const Section = require('./Section.js');

class UnitSprites extends Section {
  getSection(doc) {
    return this.getNextTableFromId('Sprites', doc);
  }

  parse() {
    let s = this.section, obj = {}, rarities = [];

    s && s.elements[0].elements.forEach( (elem, idx) => {
      rarities.push(this.rarityParsing(elem.elements[0]));
    });
    s && s.elements[1].elements.forEach( (elem, idx) => {
      obj[rarities[idx]] = this.imgToHref(this.sectionToString(elem.elements[0]));
    });

    return obj;
  }
}

module.exports = UnitSprites;
