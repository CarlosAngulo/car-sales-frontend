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
  showCreateUserComponent = false;

  constructor(
    private readonly usersService: UsersGateway
    ) {
    this.loadUsers();
  }

  loadUsers() {
    this.usersService.getAll('sortBy=createdAt:desc').subscribe((res) => {
      this.users = res.results;
      console.log(this.users)
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
        console.log(resp)
      }
    )
  }
}
