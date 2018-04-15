import { Client, Pool, PoolClient, QueryConfig, QueryResult } from 'pg';

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


    async getPoolClient(): Promise<PoolClient> {
        try {
            const client = await this.pool.connect();
            return client;
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async query(query: QueryConfig): Promise<QueryResult> {
        try {
            const client = await this.getPoolClient();
            const queryRes = await client.query(query);
            client.release();
            return queryRes;
        } catch (err) {
            return Promise.reject(err);
        }
    }

    async transaction(func: (client: PoolClient) => Promise<void>): Promise<void> {
        try {
            const client = await this.getPoolClient();
            //const queryRes = await client.query(query);
            await client.query('BEGIN')
            await func(client);
            await client.query('COMMIT')
            client.release();
            return;// queryRes;
        } catch (err) {
            return Promise.reject(err);
        }
    }


}