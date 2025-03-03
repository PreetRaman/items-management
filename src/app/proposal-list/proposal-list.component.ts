import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { ProposalService } from '../proposal.service';
import { User } from '../models/user.model';
import { Proposal } from '../models/proposal.model';
import { DataService } from '../data.service';
import { Item } from '../models/item.model';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { Owner } from '../models/owner.model';

@Component({
  selector: 'app-proposal-list',
  templateUrl: './proposal-list.component.html',
  styleUrls: ['./proposal-list.component.css']
})
export class ProposalListComponent {
  currentUser: User | null = null;
  items: Item[] = [];
  users: User [] = [];
  proposals: Proposal[] = [];
  owners: Owner[] = [];
  selectedItem: Item | null = null;
  newProposalRatios: { [partyId: number]: number } = {};
  newProposalMessage: string = '';
  acceptedProposals: { [key: number]: boolean } = {}; // Track accepted proposals using a flag
  filteredProposals: Proposal[] = []; // Store filtered proposals

  counterProposalActive = false;
  selectedProposal: Proposal | null = null; // Track selected proposal for counter proposal
  counterRatios: { [partyId: number]: number } = {};
  counterMessage: string = '';

  constructor(
    private proposalService: ProposalService,
    private dataService: DataService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private userService: UserService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.currentUser = navigation.extras.state['user'];
      this.selectedItem = navigation.extras.state['item'];
    } else {
      this.userService.currentUser$.subscribe(user => {
        this.currentUser = user;
      });
    }
  }

  ngOnInit() {
    this.items = this.dataService.getItems();
    this.users = this.dataService.getUsers();
    this.owners = this.dataService.getOwners();
    setTimeout(() => {
      this.loadProposals();
      this.filterProposals();  
    }, 100);
  }

  // Filter proposals by the selected item
  filterProposals() {
    if (this.selectedItem) {
      this.filteredProposals = this.proposals.filter(
        proposal => proposal.itemId === this.selectedItem!.id
      );
    } else {
      this.filteredProposals = [];
    }
  }

  // Load proposals for the current user
  loadProposals() {
    const allProposals = this.proposalService.getProposals();
  
    if (!allProposals) {
      this.proposals = [];
    } else {
      this.proposals = allProposals.filter(proposal =>
        proposal.paymentRatios &&
        this.currentUser?.partyId !== undefined &&
        Object.keys(proposal.paymentRatios)
          .map(Number)
          .includes(this.currentUser.partyId) // Only show proposals relevant to the current user's party
      );
    }
  
    // Load accepted proposals from localStorage
    const acceptedState = localStorage.getItem('acceptedProposals');
    if (acceptedState) {
      this.acceptedProposals = JSON.parse(acceptedState);
    } else {
      this.acceptedProposals = {};
    }
  
    // Update the accepted proposals state based on the loaded proposals
    this.updateAcceptedFlags();
  
    // Sort proposals (ascending order)
    this.proposals.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Sort by date
    });  
  }
  
  // updated accepted proposals and save the state to localStorage
  updateAcceptedFlags() {
    this.proposals.forEach(proposal => {
      this.acceptedProposals[proposal.id] = this.isProposalFullyAccepted(proposal);
    });
  
    localStorage.setItem('acceptedProposals', JSON.stringify(this.acceptedProposals));
  }
  
  // Check if all involved parties have accepted the proposal
  isProposalFullyAccepted(proposal: Proposal): boolean {
    const involvedParties = Object.keys(proposal.paymentRatios).map(Number);
    return involvedParties.every(partyId => proposal.acceptedBy.includes(partyId));
  }
  
  // Accept a proposal
  acceptProposal(proposalId: number) {
    if (!this.currentUser) return;
  
    this.proposalService.acceptProposal(proposalId, this.currentUser.partyId);
    
    // Update accepted proposals and save to localStorage
    this.acceptedProposals[proposalId] = true;
    localStorage.setItem('acceptedProposals', JSON.stringify(this.acceptedProposals));
    alert('Proposal has been accepted by all parties');
  }
  

  // Open the counter proposal form for a selected proposal
  openCounterProposalForm(proposal: Proposal) {
    this.selectedProposal = proposal;
    this.counterProposalActive = true;

    // Initialize counter proposal ratios based on the selected proposal
    this.counterRatios = { ...proposal.paymentRatios };
  }

  // Submit a counter proposal
  submitCounterProposal() {
    if (!this.selectedProposal || !this.counterMessage) {
      alert('Message is required for counter proposals.');
      return;
    }

    if (!this.currentUser) return;

    const counterProposal: Proposal = {
      id: Date.now(),
      itemId: this.selectedProposal.itemId,
      proposedBy: this.currentUser.id,
      paymentRatios: this.counterRatios,
      message: this.counterMessage,
      acceptedBy: [],
      rejectedBy: [],
      createdAt: new Date(),
    };

    this.proposalService.createProposal(counterProposal);
    this.loadProposals(); 
    this.counterProposalActive = false;
  }

  // Get item name by item ID
  getItemName(itemId: number): string {
    const item = this.items?.find(i => i.id === itemId);
    return item ? item.name : 'Loading...';
  }

  // Get the parties involved in a proposal
  getPaymentParties(proposal: Proposal): number[] {
    return Object.keys(proposal.paymentRatios).map(Number);
  }
  
  // Handle counter proposal cancel action
  cancelCounterProposal() {
    this.counterProposalActive = false;
  }

  // create new proposal
  createProposal() {
    if (!this.selectedItem) return;
    if (!this.currentUser) return;

    const proposal: Proposal = {
      id: Date.now(),
      itemId: this.selectedItem.id,
      proposedBy: this.currentUser.id,
      paymentRatios: this.newProposalRatios,
      message: this.newProposalMessage || 'New cost-sharing proposal',
      acceptedBy: [],
      rejectedBy: [],
      createdAt: new Date(),
    };

    this.proposalService.createProposal(proposal);
    this.loadProposals();
    this.selectedItem = null; // Reset selection after proposal creation
  }

  // Get current user information for header
  getUserInfo() {
    return this.currentUser ? `${this.currentUser.name} (${this.getOwnerNames(this.currentUser.partyId.toString())})` : 'Loading...';
  }

  // Get username from party id
  getUserNameByPartyId(partyId: number): string {
    const user = this.users?.find(u => u.partyId === partyId); 
    return user ? user.name : 'Unknown User';
  }
  
  // Get owner names for the proposals
  getOwnerNames(ownerId: string): string {
    console.log(ownerId)
    const owner = this.owners.find(owner => owner.id === +ownerId)
    console.log(owner)
    return owner ? owner.name : 'Unknown User'; // Return the user name if found
  }
}
