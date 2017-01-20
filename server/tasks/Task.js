const EventEmitter = require('events');
const saveStatus = require('../helpers/DBSaver.js').changeTaskStatus;

class Task extends EventEmitter {
  constructor(node, name) {
    super();

    this.name = name;
    this.node = node;
  }

  // FUNCTIONS TO IMPLEMENT
  alreadyDone() {
    throw new Error('FUNCTION NOT IMPLEMENTED');
  }

  canBeLaunch() {
    throw new Error('FUNCTION NOT IMPLEMENTED');
  }

  start() {
    throw new Error('FUNCTION NOT IMPLEMENTED');
  }

  // Used by the tasker
  done() { // Should be launched by the task when it's over
    this.node.tasksStatus[this.name] = 'done';
    saveStatus(this.node, this.name, 'done');
    this.emit('done');
  }

  error(err) {
    this.node.tasksStatus[this.name] = 'error';
    saveStatus(this.node, this.name, 'error', err);
    this.emit('error');
  }

  getStatus() {
    return this.node.tasksStatus[this.name];
  }

  init() {
    if (!this.node.tasksStatus)
      this.node.tasksStatus = {};

    if ( this.node.tasksStatus[this.name] === undefined )
      this.node.tasksStatus[this.name] = 'init';

    if ( this.alreadyDone() ) {
      if ( this.node.tasksStatus[this.name] !== 'done' ) {
        this.done();
      }
    } else {
      saveStatus(this.node, this.name, 'init');
    }
  }

  isReady() {
    let bool = this.getStatus() === 'init' &&
      this.canBeLaunch() && ! this.alreadyDone();
    return bool;
  }

  isDone() {
    return this.getStatus() === 'done';
  }

  running() {
    this.node.tasksStatus[this.name] = 'running';
    saveStatus(this.node, this.name, 'running');
    this.emit('running');
  }

  toDbStatus() {
    return { name: this.name, status: this.getStatus() };
  }

  toString() {
    return `${this.name}-${this.node.id}-${this.getStatus()}`;
  }
}

module.exports = Task;
