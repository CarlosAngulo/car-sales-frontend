import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormValidatorsService {

  constructor() { }

  boolean(required: boolean = false) {
    return (control: AbstractControl) => {
      const value = control.value;
      if (typeof value !== 'boolean' && required) {
        return { notBoolean: true };
      }
      return null;
    };
  }

  numeric(required: boolean = false) {
    return (control: AbstractControl) => {
      const value = control.value;
      if ((value === null || isNaN(value)) && required) {
        return { notNumeric: true };
      }
      return null;
    };
  }

  date(required: boolean = false) {
    return (control: AbstractControl) => {
      const value = control.value;
      if ((!(value instanceof Date) || isNaN(value.getTime())) && required) {
        return { notDate: true };
      }
      return null;
    };
  }

  password(required: boolean = true) {
    return (control: AbstractControl) => {
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
      const value = control.value;
      return passwordRegex.test(value) ? null : { notPassword: true};
    }
  }
}
