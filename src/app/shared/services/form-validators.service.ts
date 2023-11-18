import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormValidatorsService {

  constructor() { }

  booleanValidator(required: boolean = false) {
    return (control: AbstractControl) => {
      const value = control.value;
      if (typeof value !== 'boolean' && required) {
        return { notBoolean: true };
      }
      return null;
    };
  }

  numericValidator(required: boolean = false) {
    return (control: AbstractControl) => {
      const value = control.value;
      if ((value === null || isNaN(value)) && required) {
        return { notNumeric: true };
      }
      return null;
    };
  }

  dateValidator(required: boolean = false) {
    return (control: AbstractControl) => {
      const value = control.value;
      if ((!(value instanceof Date) || isNaN(value.getTime())) && required) {
        return { notDate: true };
      }
      return null;
    };
  }
}
