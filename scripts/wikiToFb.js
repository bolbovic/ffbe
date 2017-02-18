'use strict';

require('dotenv').config();

const request = require('request');
const DomParser = require('dom-parser');
const UnitParser = require('../server/parser/doc/Unit.js');
const xmlToJS = require('xml-js').xml2js;
const UnitSaver = require('../server/db/UnitSaver.js');
let parser = new DomParser();

request('http://exvius.gamepedia.com/Krile', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    const doc = parser.parseFromString(body);
    let content = xmlToJS(doc.getElementById('bodyContent').childNodes[1].outerHTML, {trim:true,addParent: true});
    let up = new UnitParser(content);
    let us = new UnitSaver(up.parse());
    us.save();
  }
});
