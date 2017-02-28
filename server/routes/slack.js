'use strict';

const up = require('../helpers/WikiUnits.js').getInstance();

module.exports = (request, reply) => {
  //console.log(request.query.text);
  try {
    let [name, ...rest] = request.query.text.split(' ');
    let ability = rest.join(' ').toLowerCase();
    //console.log(name);
    //console.log(ability);
    let unit = up.getUnitByName(name);
    if ( unit ) {
      if ( ['abilities', 'infos', 'magics', 'maxStats', 'sprites', 'stats'].indexOf(ability) !== -1 ) {
        reply({text:unit[ability]});
      } else {
        if (ability) {
          reply({text:unit.findAbility(ability) || 'Ability not found'});
        } else {
          reply{text:(unit.toString()});
        }
      }
    } else {
      reply('Unit not found');
    }
  } catch (err) {
    reply(err);
  }
};