import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { UserRoutingModule } from './user-routing.module';
import { PaymentComponent } from './payment/payment.component';
import { ReportsGateway } from '../admin/reports/domain/reports-gateway';
import { ReportsService } from '../admin/reports/infraestructure/report.service';
import {
  NbAccordionModule,
  NbActionsModule,
  NbCardModule,
  NbContextMenuModule,
  NbDatepickerModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbSpinnerModule,
  NbUserModule
} from '@nebular/theme';
import { ProfileComponent } from './profile/profile.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    UserComponent,
    PaymentComponent,
    ProfileComponent,
  ],
  imports: [
    CommonModule,
    NbIconModule,
    NbFormFieldModule,
    NbAccordionModule,
    NbActionsModule,
    NbCardModule,
    NbInputModule,
    NbLayoutModule,
    NbSpinnerModule,
    NbUserModule,
    RouterModule,
    SharedModule,
    UserRoutingModule,
    NbContextMenuModule,
    NbDatepickerModule.forRoot(),
  ],
  providers: [
    {
      provide: ReportsGateway,
      useClass: ReportsService
    }
  ]
})
export class UserModule { }
