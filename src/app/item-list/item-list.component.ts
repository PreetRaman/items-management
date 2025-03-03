import { Component, Input } from '@angular/core';
import { DataService } from '../data.service';
import { Item } from '../models/item.model';
import { Owner } from '../models/owner.model';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css']
})
export class ItemListComponent {

  currentUser: User | null = null;
  items: Item[] = [];
  searchQuery = '';
  sortBy = 'name';
  owners: Owner[] = [];
  filteredItems: Item[] = [];
  proposedCostSharing: { [key: string]: number } = {}; // Store cost-sharing input

  constructor(private dataService: DataService, private router: Router, private userService: UserService) {  }
  ngOnInit() {
    this.userService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.filterItems();
    });

    this.items = this.dataService.getItems();
    this.owners = this.dataService.getOwners();
    this.filterItems();
  }

  ngOnChanges() {    
    this.filterItems();
  }

  // Filter items
  filterItems() {
    if (!this.currentUser) {
      this.filteredItems = []; // If no user is selected, don't show items
      return;
    }
  
    const userPartyId = this.currentUser.partyId;
  
    // Ensure items exist before filtering
    this.filteredItems = this.items.filter(item => 
      item.ownerIds.includes(userPartyId)
    );
  }

  // Map owner ID to names
  getOwnerNames(ownerIds: number[]): string {
    return ownerIds
      .map(id => this.owners.find(owner => owner.id === id)?.name || 'Unknown')
      .join(', ');
  }

  // Check if proposal is shared among different parties
  isShared(ownerIds: number[]): boolean {
    return ownerIds.length > 1;
  }

  // Load items
  loadItems() {
    if (!this.items.length) return;
  
    this.filteredItems = this.items.filter(item =>
      item.ownerIds.includes(this.currentUser?.partyId ?? -1)
    );
  
    if (this.searchQuery.trim()) {
      this.filteredItems = this.filteredItems.filter(item =>
        item.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    this.sortItems();
  }

  // Navigate to proposals when user wants to create a proposal for selected item
  createProposal(item: Item) {
    this.router.navigate(['/proposals'], {
      state: { user: this.currentUser, item },
    });
  }

  // Add sorting for list of items
  sortItems() {
    if (this.sortBy === 'name') {
      this.filteredItems.sort((a, b) => a.name.localeCompare(b.name));
    } else if (this.sortBy === 'cost') {
      this.filteredItems.sort((a, b) => a.totalCost - b.totalCost);
    }
  }
}
