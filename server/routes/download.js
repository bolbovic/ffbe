'use strict';

const Boom = require('boom');
const FireHelper = require('../helpers/firehelper.js');
const Request = require('request');
const archiver = require('archiver');

module.exports = (request, reply) => {
  FireHelper
  .getDownloadData(request.params.id).then( (data) => {
    if(data.data === null) {
      const error = Boom.badRequest('File Not Found');
      error.output.statusCode = 404;
      error.reformat();
      return reply(error);
    }
    else {
      let archive = archiver.create('zip', {});
      data.data.files.forEach((file) => {
        archive.append( Request(file.url) , { name: `${file.filename}.${file.extension}` } );
      });
      archive.finalize();
      archive.on('error', function(err) {
        reply(err);
      });
      //Funky contetn disposition to allow correct japanese naming of downlaoded files
      reply(archive).header('Content-disposition', `attachment; filename*=UTF-8''${encodeURIComponent(request.params.id)}.zip`);
    }
  })
  .catch((err) => {
    const error = Boom.badRequest(err.error);
    error.output.statusCode = err.status;
    error.reformat();
    return reply(err);
  });
};