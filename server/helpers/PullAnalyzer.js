'use strict';
/*const ImageDataURI = require('image-data-uri');
const DBSaver = require('./DBSaver.js');
const exec = require('child_process').exec;
const fs = require('fs');*/
const ElevenPullsAnalyzer = require('../tasks/ElevenPullsAnalyzer.js');

module.exports = (upload) => {
  let epa = new ElevenPullsAnalyzer(upload);
  epa.start();

  // Saving image to work on it
  /*let filePrefix = `./tmp/${upload.id}`;
  let fileName = `${filePrefix}.png`;
  ImageDataURI.outputFile(upload.src, fileName);

  // Launch verifications
  setTimeout( () => { // Need to wait, somehow the file is not accessible if not
    ['blue', 'gold', 'rainbow'].forEach( color => {
      let cmd = 'compare -metric rmse -subimage-search';
      let colorFile = `./img/podiums/${color}.png`;
      let compareResultFile = `${filePrefix}-${color}-result.png`;
      let compareRealResultName = `${filePrefix}-${color}-result-1.png`;
      let maximaResultFile = `${filePrefix}-${color}-result-maxima.png`;
      exec(`${cmd} ${fileName} ${colorFile} ${compareResultFile}`, (err, stdout, stderr) => {
        if ( err.code !== 1 ) {
          console.log('ERROR');
          console.log(err);
          return;
        }
        // Verify if file exist
        try {
          fs.accessSync(compareRealResultName);
          // Launch maximas
          let cmd = './scripts/maxima -n 11 -t 90';
          exec(`${cmd} ${compareRealResultName} ${maximaResultFile}`, (err, stdout, stderr) => {
            if ( !err ) {
              let lines = stdout.split('\n'), pods = [];
              lines.forEach( line => {
                if ( line !== '' ) {
                  let [coord, gray] = line.split(' ');
                  let [x, y] = coord.split(',');
                  let [a,b,percent] = gray.split(',');
                  //console.log(x, y, parseInt(percent));
                  pods.push({x, y, percent});
                }
              });
              DBSaver.savePods(upload.id, color, pods);
              //console.log(stdout);
            }
          });
        } catch (err) {
          console.log(err);
        }
      });
    });
  }, 1000);
  */
  return null;
};
