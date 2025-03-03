import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '../models/user.model';
import { DataService } from '../data.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
  users: User[] = [];
  @Output() userChanged = new EventEmitter<User>(); // Emits user change

  constructor(private dataService: DataService) {
    this.users = this.dataService.getUsers();
  }

  switchUser(userId: string) {
    const selectedUser = this.users.find(user => user.id === Number(userId)); // Convert string to number
    if (selectedUser) {
      this.userChanged.emit(selectedUser); // Emit selected user
    }
  }
 }
