'use strict';

const up = require('../helpers/WikiUnits.js').getInstance();

module.exports = (request, reply) => {
  //console.log(request.query.text);
  let [name, ...rest] = request.query.text.split(' ');
  let ability = rest.join(' ').toLowerCase();
  //console.log(name);
  //console.log(ability);
  let unit = up.getUnitByName(name);
  if ( unit ) {
    if ( ['abilities', 'infos', 'magics', 'maxStats', 'sprites', 'stats'].indexOf(ability) !== -1 ) {
      reply(infos[ability]);
    } else {
      if (ability) {
        reply(unit.findAbility(ability) || 'Ability not found');
      } else {
        reply(unit.toString());
      }
    }
  } else {
    reply('Unit not found');
  }
};