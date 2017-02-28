'use strict';

const up = require('../helpers/WikiUnits.js').getInstance();
const request = require('request');

const sendToSlack = (txt, query, reply) => {
  let apiObject = {
    channel: query.channel || '@bolubo',
    text: txt,
    username: `FFBE Wiki - ${query.text}`
  };
  let webHook = process.env.SLACK_WEBHOOK;
  request.post({body:JSON.stringify(apiObject), url:webHook}, (err, res, body) => {
    if ( err ) {
      console.warn(err);
      reply({'ok': false, 'text': err});
    } else {
      reply();
    }
  });
}

module.exports = (request, reply) => {
  try {
    let [name, ...rest] = request.query.text.split(' ');
    let ability = rest.join(' ').toLowerCase();
    let unit = up.getUnitByName(name);
    if ( unit ) {
      if ( ['abilities', 'infos', 'magics', 'maxStats', 'sprites', 'stats'].indexOf(ability) !== -1 ) {
        sendToSlack(unit[ability], request.query, reply);
      } else {
        if (ability) {
          let ab = unit.findAbility(ability) || 'Ability not found';
          sendToSlack(ab, request.query, reply);
        } else {
          sendToSlack(unit.toString(), request.query, reply);
        }
      }
    } else {
      reply('Unit not found');
    }
  } catch (err) {
    reply(err);
  }
};