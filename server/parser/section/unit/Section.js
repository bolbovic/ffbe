const Section = require('../../Section.js');

class UnitSection extends Section {
  getNextTableFromId(name, doc) {
    let span = this.getElementById(name, doc);
    if ( span ) {
      let h2 = span.parent;
      let h2Parent = h2.parent;
      return h2Parent.elements[h2Parent.elements.indexOf(h2)+1];
    } else {
      return null;
    }
  }

  imgToHref(img) {
    let re = /src="([^"]+)"/;
    let found = img.match(re);
    return found ? found[1] : 'bad url';
  }

  rarityParsing(elem) {
    let re = new RegExp(/Rarity-([1-6])\.png/, 'gi')
    let res = re.exec(this.sectionToString(elem));
    return parseInt(res[1]);
  }
}

module.exports = UnitSection;
