import { Component, EventEmitter, Input, Output, AfterViewInit, SimpleChanges, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, catchError, of, takeUntil } from 'rxjs';
import { IUserDTO, Roles } from 'src/app/models/user.model';
import { UsersGateway } from '../domain/users-gateway';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements AfterViewInit, OnChanges {
  @Output() onUserCreated: EventEmitter<IUserDTO> = new EventEmitter<IUserDTO>();
  @Output() onCancelCreation: EventEmitter<void> = new EventEmitter();
  @Input() user!: IUserDTO | undefined;
  
  isAdmin = false;
  createUserForm!: FormGroup;
  unsubscribe$: Subject<void> = new Subject<void>();
  roles: any[] = [
    { text: 'Regular User', value: 'user'},
    { text: 'Administrator', value: 'admin'}
  ];

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersGateway
  ) {}

  ngOnInit(): void {
    this.createUserForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [ Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/) ]],
      role: ['user', [Validators.required]]
    });
  }

  ngAfterViewInit(): void {
    this.user && this.preFillOut(this.user);
  }

  preFillOut(user:IUserDTO) {
    if (!user) return;
    this.createUserForm.patchValue({
      email: user.email,
      name: user.name,
      role: user.role
    })
    this.isAdmin = user.role === Roles.ADMIN;
  }

  onRoleChange(event: boolean) {
    this.createUserForm.get('role')?.patchValue(event ? Roles.ADMIN : Roles.USER);
  }

  onCancel(): void {
    this.clearForm();
    this.onCancelCreation.next();
  }

  onSubmit() {
    if (this.createUserForm.valid) {
      const name = this.createUserForm.get('name')?.value;
      const email = this.createUserForm.get('email')?.value;
      const role = this.createUserForm.get('role')?.value;

      const action = this.user 
      ? this.usersService.updateUser({
        id: this.user.id,
        name,
        email,
        role
      } as IUserDTO)
      : this.usersService.createUser(name, email, role)

      action
      .pipe(
        takeUntil(this.unsubscribe$),
        catchError((x) => of(x.error))
      )
      .subscribe((userData: IUserDTO) => {
        if (userData.id) {
          this.clearForm();
          this.onUserCreated.next(userData)
        }
      });
    }
  }

  clearForm() {
    this.createUserForm.reset(this.createUserForm.value)
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const user: IUserDTO = changes['user']?.currentValue;
    if(user && this.createUserForm) {
      this.preFillOut(user);
    }
  }
}
