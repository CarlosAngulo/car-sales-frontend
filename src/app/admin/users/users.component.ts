import { Component } from '@angular/core';
import { IUserDTO } from 'src/app/models/user.model';
import { UsersGateway } from './domain/users-gateway';
import { NbDialogService } from '@nebular/theme';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { of, switchMap } from 'rxjs';

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
    private readonly usersService: UsersGateway,
    private readonly dialogService: NbDialogService
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

  deleteUser(userId: string) {
    this.dialogService.open(ConfirmDialogComponent, {
      context: {
        icon: 'alert-triangle',
        title: 'Delete User',
        message: `<p>Are you sure you want to delete this user?</p>
        <p>This element cannot be recovered after this operation.</p>`
      }
    })
    .onClose
    .pipe(
      switchMap((res: any) => res ? this.usersService.deleteUser(userId) : of(false))
    )
    .subscribe((res: any) => {
      if (res) { this.loadUsers() }
    });
  }

  emailUser(userId: string) {
    console.log('email User')
  }
  
  editUser(userId: string) {
    console.log('edit User')
  }
  
}
