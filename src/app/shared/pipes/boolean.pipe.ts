import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booleanToString'
})
export class BooleanToStringPipe implements PipeTransform {
  transform(value: boolean | undefined): string {
    return value ? 'yes' : 'no';
  }
}