'use strict';
require('dotenv').config();
const { Database } = require('./helpers/firebase.js');
const up = require('./helpers/UnitPool.js').getInstance();
const ElevenPullsAnalyzer = require('./tasks/ElevenPullsAnalyzer.js');

const ENDPOINT = 'uploads';

up.on('done', () => {
  console.log('UnitPool ready.');
  Database
    .ref()
    .child(ENDPOINT)
    .orderByChild('apiState')
    .equalTo(null)
    .on('child_added', (snap) => {
      const db = Database.ref().child(ENDPOINT).child(snap.key);
      const upload = snap.val();
      console.log(`New ${upload.type} upload!`);
      //db.child('apiState').set('pending');
      if ( upload.type === '11pull' ) {
        let epa = new ElevenPullsAnalyzer(upload);
        epa.init();
        epa.start();
        //console.log(pa);
        //db.child('apiState').set('ok');
        //db.child('pulls').set(pa);
      }
      //console.log(upload);
    });
  console.log('Server running.');
});
console.log('Initializating...');
