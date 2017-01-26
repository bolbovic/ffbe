const sync = require('synchronize');
const cp = require('child_process');
sync(cp, 'execFile')
let id = '-KbEsYYprnioB2PWutpz', num = 8, u = 'grom';

let filePrefix = `./tmp/${id}-unit-${num}`;
let cmd = 'compare -metric rmse -subimage-search';
let uFile = `./img/units/${u}.png`;
let cpRes = `${filePrefix}-${u}-result.png`;
let std;
sync.fiber( () => {
  std = sync.await(
   cp.execFile(`${cmd} ${filePrefix}.png ${uFile} ${cpRes}`, sync.defers() )
  );
})
console.log(std);
console.log('aha');
