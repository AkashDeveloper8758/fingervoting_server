
import { getQldbDriver } from "../connectToLedger.js";
import {
    CANDIDATES_TABLE_NAME,
    VOTERS_TABLE_NAME,
    ELECTIONS_TABLE_NAME,
    VOTER_INDEX,
    CANDIDATE_INDEX,
    ELECTION_INDEX,

} from "../utils/constants.js";
import { error, log } from "../utils/logUtil.js";

function preetyPrint(result) {
    var value = JSON.stringify(result.getResultList(), null, 2)
    console.log(value)
    return JSON.parse(value)
}


export async function createIndex(txn, tableName, indexAttribute) {
    const statement = `CREATE INDEX on ${tableName} (${indexAttribute})`;
    var result = await txn.execute(statement)
    // log(`Successfully created index ${indexAttribute} on table ${tableName}.`);
    // return result.getResultList().length;
}
export async function createTable(txn, tableName) {
    const statement = `CREATE TABLE ${tableName}`;
    var result = await txn.execute(statement)
    log(`table created : ${tableName} `)
    // return result.getResultList().length;
}

export async function insertDocument(txn, tableName, documents) {
    const statement = `INSERT INTO ${tableName} ?`;
    const result = await txn.execute(statement, documents);
    log(result)
    return result;
}

export async function updateVoterList(txn, voterId, candidateId) {
    const statement = `UPDATE ${CANDIDATES_TABLE_NAME} AS c
    INSERT INTO c.votersList VALUE '${voterId}'
    WHERE c.candidateId = '${candidateId}'`
    const result = await txn.execute(statement)
    console.log('result : ', result)
}

const initialExecutor = async function () {
    try {
        const qldbDriver = getQldbDriver();
        await qldbDriver.executeLambda(async (txn) => {
            Promise.all([
                // createIndex(txn, CANDIDATES_TABLE_NAME, CANDIDATE_INDEX),
                // insertDocument(txn,CANDIDATES_TABLE_NAME,myCandidate)

                // --------- create table -------------
                // createTable(txn,CANDIDATES_TABLE_NAME),
                // createTable(txn,VOTERS_TABLE_NAME),
                // createTable(txn,ELECTIONS_TABLE_NAME),

                // --------- create table indexes -------------
                // createIndex(txn,CANDIDATES_TABLE_NAME,CANDIDATE_INDEX),
                // createIndex(txn,VOTERS_TABLE_NAME,VOTER_INDEX),
                // createIndex(txn,ELECTIONS_TABLE_NAME,ELECTION_INDEX),

                // --------- insert dummy data -------------
                // insertDocument(txn,ELECTIONS_TABLE_NAME,ELECTION_DUMMY_ITEM),
                // insertDocument(txn,CANDIDATES_TABLE_NAME,CANDIDATE_DUMMY_ITEM),
                // insertDocument(txn,VOTERS_TABLE_NAME,VOTER_DUMMY_ITEM),

                // ---------- update query --------------
                updateVoterList(txn, 'master', '123')

            ])
        });
    } catch (e) {
        error(`Unable to create index: ${e}`);
    }
}

// ------------------- inserts ---------------------- 

export async function createVoterFn(document) {
    const qldbDriver = getQldbDriver();
    // var document = formatVoter(voterId, voterPassword, voterName, voterAge)
    await qldbDriver.executeLambda(async (txn) => {
        Promise.all([
            insertDocument(txn, VOTERS_TABLE_NAME, document)
        ])
    })
}

export async function createCandidateFn(document) {
    const qldbDriver = getQldbDriver();
    // var document = formatCandidate(candidateId,candidateName,candAge,partyName,electionId)
    await qldbDriver.executeLambda(async (txn) => {
        Promise.all([
            insertDocument(txn, CANDIDATES_TABLE_NAME, document)
        ])
    })
}
export async function createElectionFn(document) {
    const qldbDriver = getQldbDriver();
    // var document = formatElection(electionId,electionName)
    await qldbDriver.executeLambda(async (txn) => {
        Promise.all([
            insertDocument(txn, ELECTIONS_TABLE_NAME, document)
        ])
    })
}

//----------------------- updates -------------------- 

export async function updateVoterListInCandidateFn(voterId, candidateId) {
    const qldbDriver = getQldbDriver();
    // var document = formatElection(electionId,electionName)
    await qldbDriver.executeLambda(async (txn) => {
        Promise.all([
            updateVoterList(txn, voterId, candidateId)
        ])
    })
}

// --------------------- get queries -----------------------

export async function getElectionsFn() {
    const qldbDriver = getQldbDriver();
    await qldbDriver.executeLambda(async (txn) => {
        var statement = `SELECT * FROM ${ELECTIONS_TABLE_NAME}`
        var result = await txn.execute(statement)
        return preetyPrint(result)
    })
}

export async function getCandidateByElectionIdFn(electionId) {
    const qldbDriver = getQldbDriver();
    await qldbDriver.executeLambda(async (txn) => {
        var statement = `SELECT * FROM ${CANDIDATES_TABLE_NAME} WHERE electionId = '${electionId}'`
        var result = await txn.execute(statement)
        return preetyPrint(result)
    })
}
export async function getCandidatesFn() {
    const qldbDriver = getQldbDriver();
    await qldbDriver.executeLambda(async (txn) => {
        var statement = `SELECT * FROM ${CANDIDATES_TABLE_NAME}`
        var result = await txn.execute(statement)
        return preetyPrint(result)
    })
}

export async function getVoterByIdFn(voterId) {
    const qldbDriver = getQldbDriver();
    return await qldbDriver.executeLambda(async (txn) => {
        var statement = `SELECT * FROM ${VOTERS_TABLE_NAME} WHERE voterId = '${voterId}'`
        var result = await txn.execute(statement)
        var value = preetyPrint(result)
        return value
    })
}
export async function verifyVoterIdAndPassword(voterId, password) {
    var result = await getVoterByIdFn(voterId)
    if (result.length > 0) {
        if (result[0].password == password) {
            return true
        } else {
            return false
        }
    }
}
