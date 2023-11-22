import { Component } from '@angular/core';
import { IUserDTO } from 'src/app/models/user.model';
import { UsersGateway } from './domain/users-gateway';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  users!: IUserDTO[];
  currentUserId!: string;
  showCreateUserComponent = false;

  constructor(
    private readonly usersService: UsersGateway
    ) {
    this.loadUsers();
    const authAppToken = localStorage.getItem('auth_app_token');
    if (authAppToken){
      this.currentUserId = JSON.parse(authAppToken).value.user.id;
    }
  }

  loadUsers() {
    this.usersService.getAll('sortBy=createdAt:desc').subscribe((res) => {
      this.users = res.results.filter((result) => result.id !== this.currentUserId);
    });
  }

  onAddUserClick() {
    this.showCreateUserComponent = true;
  }

  hideAddUser() {
    this.showCreateUserComponent = false; 
  }

  userCreated(event: IUserDTO) {
    this.hideAddUser();
    this.loadUsers();
  }

  deleteUser(id: string) {
    this.usersService.deleteUser(id).subscribe(
      (resp) => {
        this.loadUsers();
      }
    )
  }
}
