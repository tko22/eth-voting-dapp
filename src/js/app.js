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
    VotingContract.defaults({from: window.web3.eth.accounts[0],gas:6721975})
    VotingContract.deployed().then(function(instance){
      instance.getNumOfCandidates.call().then(function(numOfCandidates){
        if (numOfCandidates == 0){
          instance.addCandidate("Candidate1","Democratic").then(function(candidateID){
            $(".candidate-box").append(`<div class="form-check"><input class="form-check-input" type="checkbox" value="" id=${candidateID}><label class="form-check-label" for=${candidateID}>Candidate1</label></div>`)
          })
          instance.addCandidate("Candidate2","Republican").then(function(candidateID){
            $(".candidate-box").append(`<div class="form-check"><input class="form-check-input" type="checkbox" value="" id=${candidateID}><label class="form-check-label" for=${candidateID}>Candidate1</label></div>`)
          })
        }
        else {
          for (var i = 0; i < numOfCandidates; i++ ){
            instance.getCandidate(i).then(function(data){
              $(".candidate-box").append(`<div class="form-check"><input class="form-check-input" type="checkbox" value="" id=${data[0]}><label class="form-check-label" for=${data[0]}>${window.web3.toAscii(data[1])}</label></div>`)
            })
          }
        }
        window.numOfCandidates = numOfCandidates
      })
    }).catch(function(err){
      console.error("ERROR! " + err.message)
    })
  },
  vote: function() {
    var uid = $("#id-input").val()
    if (uid == ""){
      $(".msg").html("<p>Please enter id.</p>")
      return
    }
    if ($(".candidate-box :checkbox:checked").length > 0){
      // just takes the first checked box
      var candidateID = $(".candidate-box :checkbox:checked")[0].id
    } 
    else {
      $(".msg").html("<p>Please vote for a candidate.</p>")
      return
    }
    VotingContract.deployed().then(function(instance){
      instance.vote(uid,parseInt(candidateID)).then(function(){
        $(".msg").html("<p>Voted</p>")
      })
    })
  },
  findNumOfVotes: function() {
    VotingContract.deployed().then(function(instance){
      var box = $("<section></section>")
      for (var i = 0; i < window.numOfCandidates; i++){
        var candidatePromise = instance.getCandidate(i)
        var votesPromise = instance.totalVotes(i)
        Promise.all([candidatePromise,votesPromise]).then(function(data){
          box.append(`<p>${window.web3.toAscii(data[0][1])}: ${data[1]}</p>`)
          console.log(data)
        })
      }
      $("#vote-box").html(box)
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