import { Component } from '@angular/core';
import { IUserDTO } from 'src/app/models/user.model';
import { UsersGateway } from './domain/users-gateway';
import {
  NbDialogService,
  NbGlobalPosition,
  NbGlobalPhysicalPosition,
  NbToastrService
} from '@nebular/theme';
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
  userToEdit!: IUserDTO | undefined;
  toastrPositions = NbGlobalPhysicalPosition;

  constructor(
    private readonly usersService: UsersGateway,
    private readonly dialogService: NbDialogService,
    private toastrService: NbToastrService
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
    this.userToEdit = undefined;
    this.showCreateUserComponent = true;
  }

  hideAddUser() {
    this.showCreateUserComponent = false; 
  }

  userCreated(event: IUserDTO) {
    this.showToastr('The user has created');
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
      switchMap((res: any) => res ? this.usersService.deleteUser(userId) : of(false)),
    )
    .subscribe((res: any) => {
      if (res.success) {
        this.showToastr('The user has been removed successfully');
        this.loadUsers();
        return;
      }
      if (res.usedIn) {
        this.toastrService.show(
          'Error',
          `This user has ${res.usedIn} reviews assigned`,
          {
            position: this.toastrPositions.BOTTOM_LEFT,
            status: 'danger'
          }
        );
        return
      }
    });
  }

  emailUser(userId: string, username: string) {
    this.showToastr(`The reset password has been sent to ${username}`);
  }
  
  editUser(userId: string) {
    this.usersService.getById(userId)
    .subscribe((user) => {
      this.showCreateUserComponent = true;
      this.userToEdit = user;
    });
  }

  showToastr(message: string, status: string = 'Success', position = this.toastrPositions.BOTTOM_LEFT ) {
    this.toastrService.show(
      status,
      message,
      {
        position,
        status: status.toLowerCase()
      }
    );
    return;
  }
  
}
