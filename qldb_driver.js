var qldb = require('amazon-qldb-driver-nodejs');
var https = require('https');

function main() {
    var maxConcurrentTransactions = 10;
    var retryLimit = 4;

    var agentForQldb = new https.Agent({
        keepAlive: true,
        maxSockets: maxConcurrentTransactions
    });

    var serviceConfigurationOptions = {
        region: "us-east-2",
        httpOptions: {
            agent: agentForQldb
        }
    };

    // Use driver's default backoff function for this example (no second parameter provided to RetryConfig)
    var retryConfig = new qldb.RetryConfig(retryLimit);
    var driver = new qldb.QldbDriver("fingervotingledger", serviceConfigurationOptions, maxConcurrentTransactions, retryConfig);
    driver.executeLambda((txn)=>{
        createTable(txn)
    })
}

async function createTable(txn) {
    await txn.execute("CREATE TABLE People");
}


main();