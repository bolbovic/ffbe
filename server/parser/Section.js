const jsToXml = require('xml-js').js2xml;

class Section {
  constructor(document) {
    this.section = this.getSection(document);
  }

  getElementsByClass(className, section = null) {
    if ( section === null ) {
      section = this.section;
    }
    return this.recursiveAttributeSearch(section, 'class', className, true);
  }

  getElementById(id, section = null) {
    if ( section === null ) {
      section = this.section;
    }
    return this.recursiveAttributeSearch(section, 'id', id)[0];
  }

  // To change
  getSection(document) {
    return document.childNodes[0];
  }

  // To change
  parse() {
    return {};
  }

  recursiveAttributeSearch(section, attributeName, value, sp = false) {
    if ( section === undefined ) {
      return [];
    }
    let array = [];
    if ( section.elements !== undefined ) {
      section.elements.forEach( (child) => {
        array = array.concat(this.recursiveAttributeSearch(child, attributeName, value, sp));
      });
    }
    let sa = section.attributes;
    if ( sa && sa[attributeName] ) {
      if ( (sp && sa[attributeName].split(' ').indexOf(value) !== -1 )
        || (!sp && sa[attributeName] === value ) ) {
        array.push(section);
      }
    }
    return array;
  }

  sectionToString(s) {
    return jsToXml(s);
  }
}

module.exports = Section;
