import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Item } from './models/item.model';
import { User } from './models/user.model';
import { Proposal } from './models/proposal.model';
import { Owner } from './models/owner.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private items: Item[] = [];
  private owners: Owner[] = [];
  private users: User[] = [];
  private proposalsKey = 'proposals';


  constructor(private http: HttpClient) {
    this.loadData();
  }

  // Load data from local JSON and store locally
  private loadData() {
    this.http.get<Item[]>('assets/items.json').subscribe(data => {
      this.items = data;
      localStorage.setItem('items', JSON.stringify(this.items));
    });

    this.http.get<Owner[]>('assets/owners.json').subscribe(data => {
      this.owners = data;
      localStorage.setItem('owners', JSON.stringify(this.owners));
    });

    this.http.get<User[]>('assets/users.json').subscribe(data => {
      this.users = data;
      localStorage.setItem('users', JSON.stringify(this.users));
    });
  }

  // Get list of items
  getItems(): Item[] {
    return JSON.parse(localStorage.getItem('items') || '[]');
  }

  // Get list of owners
  getOwners(): Owner[] {
    return JSON.parse(localStorage.getItem('owners') || '[]');
  }

  // Get list of users
  getUsers(): User[] {
    return JSON.parse(localStorage.getItem('users') || '[]');
  }
}
