import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'booeanToString'
})
export class BooeanToStringPipe implements PipeTransform {
  transform(value: boolean | undefined): string {
    return value ? 'yes' : 'no';
  }
}