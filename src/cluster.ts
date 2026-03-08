import cluster, { Worker } from 'node:cluster';
import os from 'node:os';

const numCPUs: number = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Primary process running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker: Worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  import('./main.js');
}
