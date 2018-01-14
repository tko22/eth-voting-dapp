// Import libraries we need.
import { default as Web3} from 'web3'
import { default as contract } from 'truffle-contract'

import votingArtifacts from '../../build/contracts/Voting.json'

var Voting = contract(votingArtifacts)

window.App = {
  start: function() {
    Voting.setProvider(window.web3.currentProvider)
    console.log("start")
  }
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