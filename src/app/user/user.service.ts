import { Injectable } from '@angular/core';
import { IUserDTO } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _user!: IUserDTO;

  constructor() { }

  set user(user: IUserDTO) {
    console.log('setting user:', user)
    this._user = user;
  }

  get user(): IUserDTO {
    return this._user;
  }
}
