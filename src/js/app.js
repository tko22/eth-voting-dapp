// import CSS. Webpack with deal with it
import "../css/style.css"

// Import libraries we need.
import { default as Web3} from "web3"
import { default as contract } from "truffle-contract"

import votingArtifacts from "../../build/contracts/Voting.json"

var VotingContract = contract(votingArtifacts)

window.App = {
  start: function() {
    VotingContract.setProvider(window.web3.currentProvider)
    VotingContract.defaults({from: window.web3.eth.accounts[0]})
    VotingContract.deployed().then(function(instance){
      instance.getNumOfCandidates.call().then(function(numOfCandidates){
        if (numOfCandidates == 0){
          instance.addCandidate("Candidate1","Democratic").then(function(candidateID){
            $(".candidate-box").append(`<div class="btn-box"><button class="btn btn-primary" id=${candidateID}>Candidate1</button></div>`)
          })
          instance.addCandidate("Candidate2","Republican").then(function(candidateID){
            $(".candidate-box").append(`<div class="btn-box"><button class="btn btn-primary" id=${candidateID}>Candidate2</button></div>`)
          })
        }
        else {
          
          for (var i = 0; i < numOfCandidates; i++ ){
            instance.getCandidate(i).then(function(data){
              $(".candidate-box").append(`<div class="btn-box"><button class='btn btn-primary' id='${data[0]}'>${window.web3.toAscii(data[1])}</button></div>`)
            })
          }
        }
      })
    }).catch(function(err){
      console.error("ERROR! " + err.message)
    })
  },
  vote: function(uid,candidateID) {
    VotingContract.deployed().then(function(instance){
      instance.vote(uid,parseInt(candidateID)).then(function(){
        $(".msg").append("<p>Voted</p>")
      })
    })
  }
}

window.addEventListener("load", function() {
  // Is there an injected web3 instance?
  if (typeof web3 !== "undefined") {
    console.warn("Using web3 detected from external source like Metamask")
    // If there is a web3 instance(in Mist/Metamask), then we use its provider to create our web3object
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:9545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask")
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:9545"))
  }
  window.App.start()
})