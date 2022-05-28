export function formatCandidate(candidateId, name, age,partyName,electionId,votersList) {
    return {
        candidateId,
        electionId,
        name,
        age,
        partyName,
        votersList,
    }
}

export function formatVoter(voterId, password, name, age) {
    return {
        voterId,
        password,
        name,
        age
    }
}

export function formatElection(electionId,electionName){
    return {
        electionId,
        electionName
    }
}

export const ELECTION_DUMMY_ITEM = formatElection('xyz','President of CESTA')
export const VOTER_DUMMY_ITEM = formatVoter('mno','password123','baby boy',18)
export const CANDIDATE_DUMMY_ITEM = formatCandidate('123','Akash Maurya',22,'India Party','xyz',[])
