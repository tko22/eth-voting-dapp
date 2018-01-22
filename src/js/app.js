// import CSS. Webpack with deal with it
import "../css/style.css"

// Import libraries we need.
import { default as Web3} from "web3"
import { default as contract } from "truffle-contract"

// assign contract
import votingArtifacts from "../../build/contracts/Voting.json"
var VotingContract = contract(votingArtifacts)

window.App = {
  start: function() {
    // setting up contract providers and transaction defaults for ALL contract instances
    VotingContract.setProvider(window.web3.currentProvider)
    VotingContract.defaults({from: window.web3.eth.accounts[0],gas:6721975})
    // creates an VotingContract instance that represents default address managed by VotingContract
    VotingContract.deployed().then(function(instance){
      instance.getNumOfCandidates.call().then(function(numOfCandidates){
        // adds candidates to Contract if there aren't any
        if (numOfCandidates == 0){
          instance.addCandidate("Candidate1","Democratic").then(function(candidateID){
            $(".candidate-box").append(`<div class="form-check"><input class="form-check-input" type="checkbox" value="" id=${candidateID}><label class="form-check-label" for=${candidateID}>Candidate1</label></div>`)
          })
          instance.addCandidate("Candidate2","Republican").then(function(candidateID){
            $(".candidate-box").append(`<div class="form-check"><input class="form-check-input" type="checkbox" value="" id=${candidateID}><label class="form-check-label" for=${candidateID}>Candidate1</label></div>`)
          })
          numOfCandidates = 2
        }
        else {
          for (var i = 0; i < numOfCandidates; i++ ){
            // gets candidates and displays them
            instance.getCandidate(i).then(function(data){
              $(".candidate-box").append(`<div class="form-check"><input class="form-check-input" type="checkbox" value="" id=${data[0]}><label class="form-check-label" for=${data[0]}>${window.web3.toAscii(data[1])}</label></div>`)
            })
          }
        }
        // sets global variable for number of Candidates
        window.numOfCandidates = numOfCandidates 
      })
    }).catch(function(err){
      console.error("ERROR! " + err.message)
    })
  },
  // Function that is called when user clicks the "vote" button
  vote: function() {
    var uid = $("#id-input").val()
    // Application Logic 
    if (uid == ""){
      $(".msg").html("<p>Please enter id.</p>")
      return
    }
    if ($(".candidate-box :checkbox:checked").length > 0){ 
      // just takes the first checked box and gets its id
      var candidateID = $(".candidate-box :checkbox:checked")[0].id
    } 
    else {
      $(".msg").html("<p>Please vote for a candidate.</p>")
      return
    }
    // Actually voting for the Candidate using the Contract
    VotingContract.deployed().then(function(instance){
      console.log(candidateID)
      instance.vote(uid,parseInt(candidateID)).then(function(){
        $(".msg").html("<p>Voted</p>")
      })
    })
  },
  // function called when the "Count Votes" button is clicked
  findNumOfVotes: function() {
    console.log("finding")
    VotingContract.deployed().then(function(instance){
      console.log("insidecontracgt")
      var box = $("<section></section>")
      // loop through the number of candidates and displays their votes
      for (var i = 0; i < window.numOfCandidates; i++){
        // calls two smart contract functions
        var candidatePromise = instance.getCandidate(i)
        var votesPromise = instance.totalVotes(i)
        Promise.all([candidatePromise,votesPromise]).then(function(data){
          console.log("inside")
          console.log(window.web3.toAscii(data[0][1]))
          box.append(`<p>${window.web3.toAscii(data[0][1])}: ${data[1]}</p>`)
        })
      }
      $("#vote-box").html(box)
    })
  }
}

// When the page loads, we create a web3 instance and set a provider
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
  // initializing the App
  window.App.start()
})