import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  NbSidebarModule,
  NbLayoutModule,
  NbUserModule,
  NbButtonModule,
  NbMenuModule,
  NbIconModule,
  NbCardModule,
  NbInputModule,
  NbFormFieldModule,
  NbToggleModule,
  NbTreeGridModule,
  NbDatepickerModule,
  NbDialogModule,
  NbSelectModule
} from '@nebular/theme';
import { NbAuthModule } from '@nebular/auth';
import { AdminComponent } from './admin.component';
import { AdminRoutingModule } from './admin-routing.module';
import { ReportsComponent } from './reports/reports.component';
import { UsersComponent } from './users/users.component';
import { UsersGateway } from './users/domain/users-gateway';
import { UsersService } from './users/infraestructure/users.service';
import { NewUserComponent } from './users/new-user/new-user.component';
import { SharedModule } from '../shared/shared.module';
import { ReportsGateway } from './reports/domain/reports-gateway';
import { ReportsService } from './reports/infraestructure/report.service';
import { UploadComponent } from './upload/upload.component';

@NgModule({
  declarations: [
    AdminComponent,
    ReportsComponent,
    UsersComponent,
    NewUserComponent,
    UploadComponent
  ],
  imports: [
    AdminRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    NbCardModule,
    NbLayoutModule,
    NbButtonModule,
    NbIconModule,
    NbUserModule,
    NbAuthModule,
    NbButtonModule,
    NbFormFieldModule,
    NbInputModule,
    NbToggleModule,
    NbSelectModule,
    NbTreeGridModule,
    SharedModule,
    NbDialogModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
  ],
  providers: [
    {
      provide: UsersGateway,
      useClass: UsersService
    },
    {
      provide: ReportsGateway,
      useClass: ReportsService
    }
  ]
})
export class AdminModule { }
