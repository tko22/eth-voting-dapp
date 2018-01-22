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

    /*
     * These state variables are used keep track of the number of Candidates/Voters 
     * and used to as a way to index them
     */
    uint numCandidates; // declares a state variable - number Of Candidates
    uint numVoters;

    /*
     * Think of these as a hash table, with the key as a uint and value of 
     * the struct Candidate. 
     */
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
            voterID = numVoters++; //voterID is the return variable
            voters[voterID] = Voter(uid,candidateID);
        }
    }

    // finds the total amount of votes for a specific candidate by looping
    // through voters 
    function totalVotes(uint candidateID) view public returns (uint) {
        uint numOfVotes = 0;
        for (uint i = 0; i < numVoters; i++) {
            if (voters[i].candidateIDVote == candidateID) {
                numOfVotes++;
            }
        }
        return numOfVotes;
    }

    /*
     *  Getter Functions
     */
    function getNumOfCandidates() public constant returns(uint) {
        return numCandidates;
    }

    function getNumOfVoters() public constant returns(uint) {
        return numVoters;
    }
}