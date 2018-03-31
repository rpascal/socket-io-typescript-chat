import { Client, Pool, PoolClient, QueryConfig } from 'pg';

import { injectable } from "inversify";

@injectable()
export class BasePostgres {

    private pool: Pool;

    constructor() {
        this.InitPool();
    }

    InitPool() {
        this.pool = new Pool({
            host: 'dbpostgres',
            port: 5432,
            database: "docker",
            user: "docker",
            password: "dockerPassword",
            max: 5,
            idleTimeoutMillis: 3000
        })
    }


    getPoolClient(): Promise<PoolClient> {
        return new Promise<PoolClient>((resolve: (value?: PoolClient | PromiseLike<PoolClient>) => void, error: (reason?: any) => void) => {
            this.pool.connect().then((value: PoolClient) => {
                resolve(value);
            }).catch(err => {
                console.log("Error Connecting to pool", err);
                error("Error Connecting to pool")
            })
        });
    }

    async query(query: QueryConfig){
        let client = await this.getPoolClient();
        return client.query(query);
    }


}