
class Doc {
  constructor(document, parserList) {
    this.document = document;
    this.parserList = parserList;
  }

  parse() {
    this.result = this.parserList.map( (parser) => {
      return parser.parse();
    });
    return this.result;
  }
}

module.exports = Doc;
