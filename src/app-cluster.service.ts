import * as cluster from 'cluster';
import * as os from 'os';
import { Injectable } from '@nestjs/common';

const numCPUs = os.cpus().length;

@Injectable()
export class AppClusterService {
    static clusterize(callback: () => void): void {
        if(cluster.isMaster){
            console.info(`Master server started on ${process.pid}`);
            for (let i = 0; i < numCPUs; i++) {
                cluster.fork();
            }
            cluster.on('exit', (worker, code, signal) => {
                console.info(`Worker ${worker.process.pid} died. Code ${code}, signal ${signal}. Restarting...`);
                cluster.fork();
            })
        } else {
            console.info(`Cluster server started on ${process.pid}`)
            callback();
        }
    }
}
