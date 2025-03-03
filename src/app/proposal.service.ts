import { Injectable } from '@angular/core';
import { DataService } from './data.service';
import { Proposal } from './models/proposal.model';

@Injectable({
  providedIn: 'root',
})
export class ProposalService {

  private proposalsKey = 'proposals';

  constructor() {}

  // Get proposals from local storage
  getProposals(): Proposal[] {
    return JSON.parse(localStorage.getItem(this.proposalsKey) || '[]');
  }

  // Save proposals to local storage
  saveProposals(proposals: Proposal[]) {
    localStorage.setItem(this.proposalsKey, JSON.stringify(proposals));
  }

  // Create a new proposal
  createProposal(proposal: Proposal) {
    const proposals = this.getProposals();
    proposals.push(proposal);
    this.saveProposals(proposals);
  }

  // Accept created proposal
  acceptProposal(proposalId: number, userPartyId: number) {
    const proposals = this.getProposals();
    const proposal = proposals.find(p => p.id === proposalId);
    
    if (proposal && !proposal.acceptedBy.includes(userPartyId)) {
      proposal.acceptedBy.push(userPartyId); // Add party to accepted list
      this.saveProposals(proposals);
    }
  }

  // Reject a created proposal
  rejectProposal(proposalId: number, userId: number, counterProposal: Proposal) {
    const proposals = this.getProposals();
    const proposal = proposals.find(p => p.id === proposalId);
    if (proposal) {
      proposal.rejectedBy.push(userId);
      this.createProposal(counterProposal);
      this.saveProposals(proposals);
    }
  }
}
