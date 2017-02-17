
class Doc {
  constructor(document, parserList) {
    this.document = document;
    this.parserList = parserList;
  }

  parse() {
    this.result = {};
    Object.keys(this.parserList).map( (key) => {
      this.result[key] = this.parserList[key].parse();
    });
    return this.result;
  }
}

module.exports = Doc;
