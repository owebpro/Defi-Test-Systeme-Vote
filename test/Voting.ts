import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { assert, expect } from "chai";
import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");


describe("Voting", () => {


	const deployContract = async () => {
		const [owner, voter1, voter2, voter3] = await ethers.getSigners();
		const Voting = await ethers.getContractFactory("Voting");
		const voting = await Voting.deploy();
		return { voting, owner, voter1, voter2, voter3 };
	}

	describe("Deployment", () => {
		
		it("Should deploy the smart contract", async () => {
			const { voting, owner, voter1, voter2, voter3 } = await loadFixture(deployContract);
			const initialWiningProposalIdValue = await voting.winningProposalID();
			expect(initialWiningProposalIdValue).to.equal(0);
		});

		it("Should set the right owner", async function () {
	      	const { voting, owner } = await loadFixture(deployContract);
	      	expect(await voting.owner()).to.equal(owner.address);
	    });

	});

	describe("After deployment", () => {

		let owner, voter1, voter2, voter3;
		let voting;

		beforeEach(async () => {
			[owner, voter1, voter2, voter3] = await ethers.getSigners();

			const Voting = await ethers.getContractFactory("Voting");
			voting = await Voting.deploy();
		});
		
		it("winningProposalID should be equal to 0", async () => {
			const initialWiningProposalIdValue = await voting.winningProposalID();
			expect(initialWiningProposalIdValue).to.equal(0);
		});
		
		it("Only voters should get voters", async () => {
		    await expect(voting.getVoter(voter1)).to.be.revertedWith("You're not a voter");
		});


		
		it("Only owner should add voters", async () => {
		    await expect(voting.connect(voter2).addVoter(voter2.address))
            .to.be.revertedWithCustomError(voting, "OwnableUnauthorizedAccount")
        	.withArgs(voter2.address);
		});
		
		it("Only owner should start proposal registration", async () => {
		    await expect(voting.connect(voter2).startProposalsRegistering())
            .to.be.revertedWithCustomError(voting, "OwnableUnauthorizedAccount")
        	.withArgs(voter2.address);
		});
		
		it("Only owner should end proposal registration", async () => {
		    await expect(voting.connect(voter2).endProposalsRegistering())
            .to.be.revertedWithCustomError(voting, "OwnableUnauthorizedAccount")
        	.withArgs(voter2.address);
		});
		
		it("Only owner should start voting session", async () => {
		    await expect(voting.connect(voter2).startVotingSession())
            .to.be.revertedWithCustomError(voting, "OwnableUnauthorizedAccount")
        	.withArgs(voter2.address);
		});
		
		it("Only owner should end voting session", async () => {
		    await expect(voting.connect(voter2).endVotingSession())
            .to.be.revertedWithCustomError(voting, "OwnableUnauthorizedAccount")
        	.withArgs(voter2.address);
		});
		
		it("Only owner should tally votes", async () => {
		    await expect(voting.connect(voter2).tallyVotes())
            .to.be.revertedWithCustomError(voting, "OwnableUnauthorizedAccount")
        	.withArgs(voter2.address);
		});


		

		
		it("Should revert with voter Voters registration is not open yet", async () => {
			await voting.startProposalsRegistering();
			await expect(voting.addVoter(voter1.address)).to.be.revertedWith('Voters registration is not open yet');
		});

		it("Should revert with voter Already registered", async () => {
			await voting.addVoter(voter1.address);
			await expect(voting.addVoter(voter1.address)).to.be.revertedWith('Already registered');
		});

		it("Should emit event VoterRegistered", async () => {
		    await expect(voting.addVoter(voter1.address))
			.to.emit(voting, "VoterRegistered")
			.withArgs(voter1.address);
		});

		

		it("Should revert with Proposals are not allowed yet", async () => {
			await voting.addVoter(voter1.address);
			await expect(voting.connect(voter1).addProposal("test")).to.be.revertedWith('Proposals are not allowed yet');
		});

		it("Should revert with 'Vous ne pouvez pas ne rien proposer'", async () => {
			await voting.addVoter(voter1.address);
			await voting.startProposalsRegistering();
			await expect(voting.connect(voter1).addProposal("")).to.be.revertedWith('Vous ne pouvez pas ne rien proposer');
		});

		it("Should find registered voter", async () => {
			await voting.addVoter(voter1.address);
			const voter = await voting.connect(voter1).getVoter(voter1.address);
			await expect(voter.isRegistered).to.equal(true);
		});

		it("Should emit event WorkflowStatusChange after startProposalsRegistering", async () => {
		    await expect(voting.startProposalsRegistering())
			.to.emit(voting, "WorkflowStatusChange")
			.withArgs(0,1);
		});

		it("Should emit event WorkflowStatusChange after endProposalsRegistering", async () => {
		    await voting.startProposalsRegistering();
		    await expect(voting.endProposalsRegistering())
			.to.emit(voting, "WorkflowStatusChange")
			.withArgs(1,2);
		});

		it("Should emit event WorkflowStatusChange after startVotingSession", async () => {
		    await voting.startProposalsRegistering();
		    await voting.endProposalsRegistering();
		    await expect(voting.startVotingSession())
			.to.emit(voting, "WorkflowStatusChange")
			.withArgs(2,3);
		});

		it("Should emit event WorkflowStatusChange after endVotingSession", async () => {
		    await voting.startProposalsRegistering();
		    await voting.endProposalsRegistering();
		    await voting.startVotingSession();
		    await expect(voting.endVotingSession())
			.to.emit(voting, "WorkflowStatusChange")
			.withArgs(3,4);
		});

		it("Should emit event WorkflowStatusChange after tallyVotes", async () => {
		    await voting.startProposalsRegistering();
		    await voting.endProposalsRegistering();
		    await voting.startVotingSession();
		    await voting.endVotingSession();
		    await expect(voting.tallyVotes())
			.to.emit(voting, "WorkflowStatusChange")
			.withArgs(4,5);
		});

		it("Should retrieve added proposal", async () => {
			await voting.addVoter(voter1.address);
			await voting.startProposalsRegistering();
			await voting.connect(voter1).addProposal("test");
			const proposal = await voting.connect(voter1).getOneProposal(1);
			await expect(proposal.description).to.equal("test");
		});

		it("Should emit event ProposalRegistered", async () => {
			await voting.addVoter(voter1.address);
			await voting.startProposalsRegistering();
		    await expect(voting.connect(voter1).addProposal("test"))
			.to.emit(voting, "ProposalRegistered");
		});


		it("Should retrieve added vote to proposal and emit event Voted", async () => {
			await voting.addVoter(voter1.address);
			await voting.addVoter(voter2.address);
			await voting.startProposalsRegistering();
			await voting.connect(voter1).addProposal("test");
		    await voting.endProposalsRegistering();
		    await voting.startVotingSession();
		    await expect(voting.connect(voter2).setVote(1))
			.to.emit(voting, "Voted")
			.withArgs(voter2.address,1);
			const proposal = await voting.connect(voter1).getOneProposal(1);
			await expect(proposal.voteCount).to.equal(1);
		});

	});

})