import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { NbAlertModule, NbButtonModule, NbInputModule } from '@nebular/theme';
import { LoginRedirectComponent } from './components/login-redirect/login-redirect.component';

@NgModule({
  declarations: [
    ResetPasswordComponent,
    LoginRedirectComponent,
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    NbAlertModule,
    NbButtonModule,
    NbInputModule,
  ]
})
export class AuthModule { }
