import { Pipe, PipeTransform } from '@angular/core';
import { IDropdownOption } from '../dropdown/dropdown.component';

@Pipe({
  name: 'dropdownOption'
})
export class DropdownOptionPipe implements PipeTransform {
  transform(value: any, keys: string[]): IDropdownOption | string {
    // debugger;
    return value !== undefined ? {
        label: value[keys[0]],
        value: value[keys[1]]
    } : '';
  }
}
