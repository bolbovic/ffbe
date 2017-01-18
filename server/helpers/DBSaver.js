'use strict';
const { Database } = require('./firebase.js');

const db = Database.ref().child('uploads');

module.exports = {
  changeStatus: (upId, status) => {
    console.log(`${upId} changing status to ${status}`);
    db.child(upId).child('apiState').set(status);
  },
  savePods: (upId, color, pods) => {
    console.log(`${upId} saving ${color} pods`);
    db.child(upId).child(`pods/${color}`).set(pods);
  }
}