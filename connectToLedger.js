import { QldbDriver, RetryConfig } from "amazon-qldb-driver-nodejs";
import { LEDGER_NAME } from "./utils/constants.js";
// import { ClientConfiguration } from "aws-sdk/clients/qldbsession.js";

import dotenv from 'dotenv'
dotenv.config()


const qldbDriver = createQldbDriver();

export function createQldbDriver() {
    var ledgerName = LEDGER_NAME

    var retryLimit = 4;
    var maxConcurrentTransactions = 10;
    var configs = {
        region:"us-east-2",
        credentials:{
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
    }
    //Use driver's default backoff function (and hence, no second parameter provided to RetryConfig)
    var retryConfig = new RetryConfig(retryLimit);
    var qldbDriver = new QldbDriver(ledgerName, configs, maxConcurrentTransactions, retryConfig);
    return qldbDriver;
}

export function getQldbDriver() {
    return qldbDriver;
}

const main = async function() {
    try {
        print('lisning table name ...')
        const tableNames= await qldbDriver.getTableNames();
        tableNames.forEach((tableName) => {
            print(tableName)
        });
    } catch (e) {
        print('error ',e)
    }
}

// function print(msg,val=''){
//     console.log(msg,val)
// }
// main()