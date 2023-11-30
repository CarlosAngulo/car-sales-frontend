import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user.component';
import { PaymentComponent } from './payment/payment.component';
import { ProfileComponent } from './profile/profile.component';

export const userRoutes: Routes = [
    {
        path: '',
        component: UserComponent,
        children: [
            {
                path: '',
                redirectTo: 'score',
                pathMatch: 'full'
            },
            {
                path: 'profile',
                component: ProfileComponent,
            },
            {
                path: 'score',
                component: PaymentComponent
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(userRoutes)],
    exports: [RouterModule]
})
export class UserRoutingModule {}