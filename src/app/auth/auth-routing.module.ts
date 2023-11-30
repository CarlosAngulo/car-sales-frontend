import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    NbAuthComponent,
    NbLoginComponent,
    NbRegisterComponent,
    NbLogoutComponent,
    NbRequestPasswordComponent,
    NbResetPasswordComponent
  } from '@nebular/auth';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { LoginRedirectComponent } from './components/login-redirect/login-redirect.component';

export const authRoutes: Routes = [
    {
        path: '',
        component: NbAuthComponent,
        children: [
            {
                path: '',
                component: LoginRedirectComponent,
            },
            {
                path: 'login',
                component: NbLoginComponent,
            },
            {
                path: 'request-password',
                component: NbRequestPasswordComponent,
            },
            {
                path: 'reset-password',
                component: ResetPasswordComponent,
            },
            {
                path: '**',
                redirectTo: 'login'
            }
        ],
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(authRoutes)
    ],
    exports: [RouterModule]
})
export class AuthRoutingModule {}