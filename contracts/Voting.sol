pragma solidity ^0.4.18;
// written for Solidity version 0.4.18 and above that doesnt break functionality

contract Voting {
    // describes a Voter, which has an id and the ID of the candidate they voted for
    struct Voter {
        bytes32 uid; // bytes32 type are basically strings
        uint candidateIDVote;
    }
    // describes a Candidate
    struct Candidate {
        bytes32 name;
        bytes32 party; 
        // "bool doesExist" is to check if this Struct exists
        // This is so we can keep track of the candidates 
        bool doesExist; 
    }
    
    uint numCandidates; // declares a state variable - 
    uint numVoters;
    // Think of this as a hash table, with the key as a uint and value of the struct Candidate
    mapping (uint => Candidate) candidates;
    mapping (uint => Voter) voters;

    function addCandidate(bytes32 name, bytes32 party) public returns (uint candidateID) {
        // candidateID is the return variable
        candidateID = numCandidates++;
        // Create new Candidate Struct with name and saves it to storage.
        candidates[candidateID] = Candidate(name,party,true);
    }

    function getCandidate(uint candidateID) public constant returns (uint,bytes32, bytes32) {
        return (candidateID,candidates[candidateID].name,candidates[candidateID].party);
    }

    function vote(bytes32 uid, uint candidateID) public returns (uint voterID) {
        if (candidates[candidateID].doesExist == true) {
            voterID = numVoters++;
            voters[voterID] = Voter(uid,candidateID);
        }
    }

    function totalVotes(uint candidateID) view public returns (uint) {
        uint numOfVotes = 0;
        for (uint i = 0; i < numVoters; i++) {
            if (voters[i].candidateIDVote == candidateID) {
                numOfVotes++;
            }
        }
        return candidateID;
    }

    function getNumOfCandidates() public constant returns(uint) {
        return numCandidates;
    }

    function getNumOfVoters() public constant returns(uint) {
        return numVoters;
    }
}