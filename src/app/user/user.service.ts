import { Injectable } from '@angular/core';
import { IUserDTO, TRole } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _user!: IUserDTO;

  constructor() { }

  set user(user: IUserDTO) {
    this._user = user;
  }

  get user(): IUserDTO {
    return this._user;
  }

  get role(): TRole {
    return this.user.role;
  }

}
