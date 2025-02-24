Voting Smart Contract can be tested with this command:

```shell
yarn hardhat test test/Voting.ts
```

Then should return :

  Voting
    Deployment
      ✔ Should deploy the smart contract
      ✔ Should set the right owner
    After deployment
      ✔ winningProposalID should be equal to 0
      ✔ Only voters should get voters
      ✔ Only owner should add voters
      ✔ Only owner should start proposal registration
      ✔ Only owner should end proposal registration
      ✔ Only owner should start voting session
      ✔ Only owner should end voting session
      ✔ Only owner should tally votes
      ✔ Should revert with voter Voters registration is not open yet
      ✔ Should revert with voter Already registered
      ✔ Should emit event VoterRegistered
      ✔ Should revert with Proposals are not allowed yet
      ✔ Should revert with 'Vous ne pouvez pas ne rien proposer'
      ✔ Should find registered voter
      ✔ Should emit event WorkflowStatusChange after startProposalsRegistering
      ✔ Should emit event WorkflowStatusChange after endProposalsRegistering
      ✔ Should emit event WorkflowStatusChange after startVotingSession
      ✔ Should emit event WorkflowStatusChange after endVotingSession
      ✔ Should emit event WorkflowStatusChange after tallyVotes
      ✔ Should retrieve added proposal
      ✔ Should emit event ProposalRegistered
      ✔ Should retrieve added vote to proposal and emit event Voted


  24 passing
