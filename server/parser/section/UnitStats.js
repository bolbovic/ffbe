const Section = require('../Section.js');

class UnitStats extends Section {
  getSection(doc) {
    return doc.elements[0].elements[0];
  }

  parse() {
    let s = this.section, obj = {}, t = this.sectionToString;
    s.elements.forEach( (elem, idx) => {
      //elem
      if ( idx === 0 ) {
        console.log( t(elem.elements[0]));
        obj.name = t(elem.elements[0]);
      } else if ( idx === 1 ) {
        obj.img = t(elem.elements[0]);
      } else {
        let p = this.textToProperty(t(elem.elements[0]));
        if ( p === 'trust') {
          obj[p] = t(elem.elements[1].elements[0]);
        } else {
          obj[p] = t(elem.elements[1]);
        }
      }
    });

    // Edit no
    obj.ids = obj.no.split(',').map( (no) => parseInt(no) );
    delete obj.no;

    // Edit stars
    let re = new RegExp(/Rarity-([1-6])\.png/, 'gi'), res = [], result;
    while (result = re.exec(obj.rarity)){
      res.push( parseInt(result[1]) );
    }
    obj.rarity = res;

    // Edit roles
    obj.roles = obj.role.split(',').map( (no) => no.trim() );
    delete obj.role;

    return obj;
  }

  textToProperty(text) {
    return text.toLowerCase().replace(' ', '-').replace('.','');
  }
}

module.exports = UnitStats;
