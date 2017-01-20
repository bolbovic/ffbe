'use strict';
const { Database } = require('./firebase.js');

const db = Database.ref().child('uploads');

module.exports = {
  changeStatus: (upId, status) => {
    console.log(`${upId} changing status to ${status}`);
    db.child(upId).child('apiState').set(status);
  },
  changeTaskStatus: (node, name, status, data) => {
    console.log(`${node.id} saving status ${status} for task ${name}`);
    if ( ! data ) {
      db.child(node.id).child(`tasksStatus/${name}`).set(status);
    } else {
      db.child(node.id).child(`tasksStatus/${name}`).set({status,data});
    }
  },
  savePods: (upId, color, pods) => {
    console.log(`${upId} saving ${color} pods`);
    db.child(upId).child(`pods/${color}`).set(pods);
  },
  saveUnits: (upId, units) => {
    console.log(`${upId} saving units`);
    db.child(upId).child(`units`).set(units);
  }
}
