// Import libraries we need.
import { default as Web3} from "web3"
import { default as contract } from "truffle-contract"

import votingArtifacts from "../../build/contracts/Voting.json"

var VotingContract = contract(votingArtifacts)

window.App = {
  start: function() {
    
    VotingContract.setProvider(window.web3.currentProvider)
    if (typeof VotingContract.currentProvider.sendAsync !== "function") {
      VotingContract.currentProvider.sendAsync = function() {
        return VotingContract.currentProvider.send.apply(
          VotingContract.currentProvider, arguments
        )
      }
    }
    VotingContract.deployed().then(function(instance){
      instance.getNumOfCandidates().then(function(numOfCandidates){
        if (numOfCandidates == 0){
          instance.addCandidate("Candidate1","Democratic").then(function(candidateID){
            $(".candidate-box").append(`<button class='btn' id=${candidateID}>Candidate1</button>`)
          })
          instance.addCandidate("Candidate2","Republican").then(function(candidateID){
            $(".candidate-box").append(`<button class='btn' id=${candidateID}>Candidate2</button>`)
          })
        }
        else {
          for (var i = 0; i < instance.getNumOfCandidates; i++ ){
            instance.getCandidate(i).then(function(data){
              $(".candidate-box").append(`<button class='btn' id='${data[0]}'>${data[1]}</button>`)
            })
          }
        }
      })
    }).catch(function(err){
      console.error("ERROR! " + err.message)
    })
  },

}



window.addEventListener("load", function() {
  // Is there an injected web3 instance?
  if (typeof web3 !== "undefined") {
    console.warn("Using web3 detected from external source like Metamask")
    // If there is a web3 instance(in Mist/Metamask), then we use its provider to create our web3object
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:7545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask")
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:7545"))
  }
  window.App.start()
})