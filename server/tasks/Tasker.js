const EventEmitter = require('events');

class Tasker extends EventEmitter {
  constructor(tasks, node) {
    super();
    this.tasks = tasks;
    this.node = node;
    this.done = true;
  }

  init() {
    this.tasks.forEach( (task) => {
      task.init();
    });
  }

  start() {
    this.nextTask();
  }

  nextTask(timeWithoutLaunch = 0) {
    //console.log(`Tasker of ${this.node.id} is looking for next tasks to execute (${timeWithoutLaunch})...`);
    let taskNotLaunched = undefined;
    this.tasks.forEach( (task) => {
      if ( task.isReady() ) {
        //console.log(` => A Task of ${this.node.id} is ready!`);
        task.on('done', this.taskDone.bind(this, task));
        task.on('error', this.taskError.bind(this));
        task.on('running', this.taskRunning.bind(this));
        task.start();
        taskNotLaunched = false;
      } else {
        if ( ! task.isDone() ) {
          taskNotLaunched = taskNotLaunched === undefined ? true : taskNotLaunched;
        }
      }
    });
    if ( taskNotLaunched === true ) {
      // Some task need time ??
      console.log('Some task need time ??? ' + this.node.id);
      if ( timeWithoutLaunch < 20 ) {
        setTimeout(this.nextTask.bind(this, timeWithoutLaunch + 1), 1000);
      } else {
        console.log('cannot finish the job it seems...');
        console.log(this.tasks);
        // TODO debug
      }
    } else if ( taskNotLaunched === undefined && this.done === false) {
      console.log(`It seems everything is done for ${this.node.id}`);
      this.done = false;
      this.emit('done');
    }
  }

  taskDone(task) {
    this.nextTask();
  }

  taskError(error, node) {
    console.error('something bad append');
    console.error(node, error);
  }

  taskRunning(node) {
    // nothing to do here
  }
}

module.exports = Tasker;
