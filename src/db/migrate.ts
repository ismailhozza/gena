import * as path from "path";

import { config } from "dotenv";

import Umzug from "umzug";
import * as mysql from "mysql2/promise";
import { Promise } from "bluebird";

// Configure dotenv.
config();

// Umzug object.
const params: Object[] = [];
const umzug = new Umzug({
    storage: "json",
    migrations: {
        params: params,
        path: path.join(__dirname, "migrations"),
        pattern: /^\d+[\w-]+\.js$/,
    },
    logging: function() {
        console.log.apply(undefined, arguments);
    },
});

// Log events.
umzug.on("migrating", (name: string, migration: Umzug.Migration) => { console.log(`migrating: ${ name } ${ migration }`); });
umzug.on("migrated",   (name: string, migration: Umzug.Migration) => { console.log(`migrated: ${ name } ${ migration }`); });
umzug.on("reverting",  (name: string, migration: Umzug.Migration) => { console.log(`reverting: ${ name } ${ migration }`); });
umzug.on("reverted",   (name: string, migration: Umzug.Migration) => { console.log(`reverted: ${ name } ${ migration }`); });


/**
 * Status command.
 */
function cmdStatus() {
    let executed;
    let pending;

    return umzug.executed()
      .then( (result) => {
        executed = result;
        return umzug.pending();
    }).then( (result) => {
        pending = result;

        executed = executed.map( (m) => {
            m.name = path.basename(m.file, ".js");
            return m;
        });

        pending = pending.map( (m) => {
            m.name = path.basename(m.file, ".js");
            return m;
        });

        const current = executed.length > 0 ? executed[0].file : "<NO_MIGRATIONS>";
        const status = {
            current: current,
            executed: executed.map( (m) => m.file),
            pending: pending.map( (m) => m.file),
        };

        console.log(JSON.stringify(status, undefined, 2));

        return status;
    });
}

function cmdMigrate() {
    return umzug.up();
}

/**
 * Reverts all migrations.
 */
function cmdReset() {
    return umzug.down({ to: 0 });
}

function cmdResetPrev() {
    return cmdStatus()
        .then((status) => {
            if( status.executed.length === 0) {
                return Promise.reject(new Error("Already at initial state"));
            }
            const prev = status.executed[status.executed.length - 1];
            return umzug.down({ to: prev });
        });
}

// Get the command.
const cmd = process.argv.length > 2 ? process.argv[2].trim() : "up";
let executedCmd;

// Create database connection.
mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    Promise: Promise,
}).then((c) => {
    // console.log(connection);
    params.push(c);

    switch (cmd) {
        // case "status":
        //     executedCmd = cmdStatus();
        //     break;

        case "up":
            // case "migrate":
            executedCmd = cmdMigrate();
            break;

        // case "next":
        // case "migrate-next":
        //     executedCmd = cmdMigrateNext();
        //     break;

        // case "down":
        case "reset":
            executedCmd = cmdReset();
            break;

        case "prev":
            executedCmd = cmdResetPrev();
            break;

        default:
            // Default to up.
            executedCmd = cmdMigrate();
    }

    // Handle command outcome.
    executedCmd
        .then((result) => {
            const doneStr = `${cmd.toUpperCase()} DONE`;
            console.log(doneStr);
            console.log("=".repeat(doneStr.length));
        })
        .catch((err) => {
            const errorStr = `${cmd.toUpperCase()} ERROR`;
            console.log(errorStr);
            console.log("=".repeat(errorStr.length));
            console.log(err);
            console.log("=".repeat(errorStr.length));
        })
        .then(() => {
            return Promise.resolve();
        })
        .then(() => process.exit(0));
});
