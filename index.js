import express from 'express'
const app = express();
import cors from 'cors'
import bodyParser from 'body-parser'

import * as queries from './qldb/qldbQueries.js'
import * as formatter from './qldb/models.js'

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cors())

app.get('/', (req, res) => res.send('Up and running ... '));

// ------------------------ GET API
app.get('/voter/:voterId', async (req, res) => {
    let voterId = req.params.voterId
    let voterData = await queries.getVoterByIdFn(voterId)
    res.json(voterData)
})

app.get('/candidates/:electionId', async (req, res) => {
    let electionId = req.params.electionId
    let voterData = await queries.getCandidateByElectionIdFn(electionId)
    res.send(voterData)
})
app.get('/candidates', async (req, res) => {
    let candidates = await queries.getCandidatesFn()
    res.send(candidates)
})
app.get('/elections', async (req, res) => {
    let elections = await queries.getElectionsFn()
    res.send(elections)
})

app.get('/verify', async (req, res) => {
    let isValid = false
    if ('voterId' in req.query && 'password' in req.query) {
        let voterId = req.query.voterId
        let password = req.query.password
        isValid = await queries.verifyVoterIdAndPassword(voterId, password)
    }
    res.send({
        'isValid': isValid
    })
})

// ------------------------ POST API ----------

app.post('/createVoter', async (req, res) => {
    try {
        const { voterId, password, name, age } = req.body
        if (voterId && password && name && age) {
            let data = formatter.formatVoter(voterId, password, name, age)
            await queries.createVoterFn(data)
            res.send('voter created -- ')
        } else {
            throw 'missing params'
        }
    } catch (error) {
        res.status(400).send({
            errorMessage: {
                message: error
            }
        })
    }
})
app.post('/createCandidate', async (req, res) => {
    try {
        const { candidateId, electionId, name, age, partyName } = req.body
        if (candidateId && electionId && partyName && name && age) {
            let data = formatter.formatCandidate(candidateId, name, age, partyName, electionId)
            await queries.createCandidateFn(data)
            res.send('candidate created -- ')
        } else {
            throw 'missing params'
        }
    } catch (error) {
        res.status(400).send({
            errorMessage: {
                message: error
            }
        })
    }
})
app.post('/createElection', async (req, res) => {
    try {
        const { electionName } = req.body
        var electionId = Date.now().toString(36) + Math.random().toString(36).substring(2)
        if (electionName) {
            let data = formatter.formatElection(electionId, electionName)
            await queries.createElectionFn(data)
            res.send({
                electionId,
                electionName
            })
        } else {
            throw 'missing params'
        }
    } catch (error) {
        res.status(400).send({
            errorMessage: {
                message: error
            }
        })
    }
})

app.post('/voteCandidate', async(req, res) => {
    try {
        
        if ('voterId' in req.query && 'candidateId' in req.query) {
            let voterId = req.query.voterId
            let candidateId = req.query.candidateId
            let result = await queries.updateVoterListInCandidateFn(voterId,candidateId)
            res.send('----- voted')
        } else {
            throw 'missing params'
        }
    } catch (error) {
        res.status(400).send({
            message:error
        })
    }
})

var PORT = process.env.PORT || 3000
app.listen(3000, () => console.log(`Example app listening on port ${PORT}!`));