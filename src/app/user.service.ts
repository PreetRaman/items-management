import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { User } from './models/user.model';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private users: User[] = []; 

  private currentUserSubject = new BehaviorSubject<User | null>(this.users.length ? this.users[0] : null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private dataService: DataService) {
    this.loadUsers();
  }

 // Get users and set default user
  private loadUsers() {
    this.users = this.dataService.getUsers();
    if (this.users.length > 0) {
      this.currentUserSubject.next(this.users[0]);
    }
  }

  /** Set the current user */
  changeUser(user: User) {
    this.currentUserSubject.next(user); // Update user
  }

  /** Get the current user */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}
