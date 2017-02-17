'use strict';

//let parse = require('parse5').parse;
const request = require('request');
const DomParser = require('dom-parser');
const UnitParser = require('../server/parser/doc/Unit.js');
const xmlToJS = require('xml-js').xml2js;

let parser = new DomParser();

request('http://exvius.gamepedia.com/Leon', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    //const doc = parse(body);
    const doc = parser.parseFromString(body);
    let content = xmlToJS(doc.getElementById('bodyContent').childNodes[1].outerHTML, {trim:true,addParent: true});
    let up = new UnitParser(content);
    console.log(up.parse());
    /*
    content.childNodes.forEach( (node, idx) => {
      if ( node.nodeName !== '#text' ) {
        console.log(node.nodeName, node.attributes, idx);
      }
      if ( [0,12].indexOf(idx) !== -1 ) {
        console.log(node.outerHTML);
      }
    });
    */
    //console.log(content.childNodes[1].childNodes[0]);
    //console.log(doc);
    //console.log(content[0].innerHTML);
    //console.log(body) // Show the HTML for the Google homepage.
  }
});
