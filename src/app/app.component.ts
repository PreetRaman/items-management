import { Component } from '@angular/core';
import { User } from './models/user.model';
import { DataService } from './data.service';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentUser!: User;
  users: User[] = [];

  constructor(private dataService: DataService, private router: Router, private userService: UserService) {
    this.users = this.dataService.getUsers();
    this.currentUser = this.users[0]; // Set default user
  }

  // User change event
  onUserChanged(user: User) {
    if (user) {
      this.userService.changeUser(user);
    }
  }
 }
