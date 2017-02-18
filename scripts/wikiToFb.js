'use strict';

require('dotenv').config();

const request = require('request');
const DomParser = require('dom-parser');
const xmlToJS = require('xml-js').xml2js;
let parser = new DomParser();


const UnitListParser = require('../server/parser/doc/UnitList.js');
const UnitParser = require('../server/parser/doc/Unit.js');
const UnitSaver = require('../server/db/UnitSaver.js');


request('http://exvius.gamepedia.com/Unit_List', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    const doc = parser.parseFromString(body);
    let content = xmlToJS(doc.getElementById('bodyContent').childNodes[1].outerHTML, {trim:true,addParent: true});
    let ul = new UnitListParser(content);
    ul.parse();
    ul.result.rares.forEach( (unit, idx) => {
      setTimeout( () => {
        request(`http://exvius.gamepedia.com/${unit.name}`, function (err, res, body) {
          const unitDoc = parser.parseFromString(body);
          let unitContent = xmlToJS(unitDoc.getElementById('bodyContent').childNodes[1].outerHTML, {trim:true,addParent: true});
          let up = new UnitParser(unitContent);
          let us = new UnitSaver(up.parse());
          console.log(up.result.infos.name);
          us.save();
        });
      }, idx * 1000);
    });
  }
});
