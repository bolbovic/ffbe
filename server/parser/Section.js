const jsToXml = require('xml-js').js2xml;

class Section {
  constructor(document) {
    this.section = this.getSection(document);
  }

  // To change
  getSection(document) {
    return document.childNodes[0];
  }

  // To change
  parse() {
    return {};
  }

  sectionToString(s) {
    return jsToXml(s);
  }
}

module.exports = Section;
