import { Pipe, PipeTransform } from '@angular/core';
import { IUserDTO } from 'src/app/models/user.model';

@Pipe({
  name: 'userName'
})
export class UserNamePipe implements PipeTransform {
  transform(value: string | IUserDTO | undefined): string {
    if (typeof value === 'string') {
      return value;
    } else if (value && value.name) {
      return value.name;
    } else {
      return '';
    }
  }
}