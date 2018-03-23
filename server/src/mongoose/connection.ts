
import { connect as mongoConnect, Connection, connection } from 'mongoose'



export class MongooseInit {

    private db: Connection;

    constructor() {

    }


    public connect() {
        mongoConnect("mongodb://mongodb:27017", {
//admin:password@
// /db
        })
        console.log("After connect")
        // , {
        //     db: { safe: true }
        // }

        this.db = connection;
        this.db.on('error', console.error.bind(console, 'connection error:'));
        this.db.once('open', function () {
            console.log("Connection opended")
        });
    }

    public getDB() {
        return this.db;
    }

}