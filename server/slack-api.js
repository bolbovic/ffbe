'use strict';
require('dotenv').config();

const Hapi = require('hapi');

const slackHandler = require('./routes/slack');
const up = require('./helpers/WikiUnits.js').getInstance();

const server = new Hapi.Server();
const apiPrefix = '';

server.connection({
  host: '0.0.0.0',
  port: 1337/*,
  routes: {
    cors: {
      additionalHeaders: ['Accept-Language']
    }
  }*/
});


up.on('done', () => {
  server.route({
    method: 'GET',
    path: apiPrefix + '/slack',
    handler: slackHandler
  });

  server.start(() => {
    console.info('Server running at:', server.info.uri);
  });
});
