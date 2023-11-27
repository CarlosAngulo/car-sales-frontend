import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NbPasswordAuthStrategy } from '@nebular/auth';
import { catchError } from 'rxjs';
import { FormValidatorsService } from 'src/app/shared/services/form-validators.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  resetPasswForm!: FormGroup;
  inputValsMatch = false;
  error = false;
  success = false;
  token = '';

  constructor(
    private route: ActivatedRoute,
    private passwordStrategy: NbPasswordAuthStrategy,
    private fb: FormBuilder,
    private validators: FormValidatorsService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
    });
  }

  ngOnInit(): void {
      this.resetPasswForm = this.fb.group({
        password: ['', [Validators.required, this.validators.password()]],
        confirmPassword: ['', [Validators.required, this.validators.password()]],
        token: [this.token, [Validators.required]]
      });

      if (this.token) {
        this.resetPasswForm.get('token')?.setValue(this.token);
      }

      this.resetPasswForm.valueChanges.subscribe(
        (inputVal) => {
          this.inputValsMatch = inputVal.password === inputVal.confirmPassword
          console.log(this.inputValsMatch, this.resetPasswForm.value)
        }
      )
  }

  onResetPassword() {
    console.log(this.passwordStrategy)
    console.log(this.resetPasswForm.value)
    this.passwordStrategy.resetPassword(this.resetPasswForm.value)
    .pipe(
      catchError((error) => error)
    )
    .subscribe((res:any) => {
      if (res.message) {
        this.error = true;
        return;
      }
      this.success = true;
    })
  }
}