import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
  NbSelectModule,
  NbSpinnerModule,
  NbContextMenuModule,
  NbPopoverModule,
  NbToastrModule
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
import { StoresComponent } from './stores/stores.component';
import { StoresGateway } from './stores/domain/stores-gateway';
import { StoresService } from './stores/infraestructure/stores.service';

@NgModule({
  declarations: [
    AdminComponent,
    ReportsComponent,
    UsersComponent,
    NewUserComponent,
    UploadComponent,
    StoresComponent
  ],
  imports: [
    AdminRoutingModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    FormsModule,
    NbCardModule,
    NbSpinnerModule,
    NbLayoutModule,
    NbButtonModule,
    NbIconModule,
    NbUserModule,
    NbAuthModule,
    NbFormFieldModule,
    NbInputModule,
    NbPopoverModule,
    NbToggleModule,
    NbSelectModule,
    NbTreeGridModule,
    NbContextMenuModule,
    SharedModule,
    NbToastrModule.forRoot(),
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
    },
    {
      provide: StoresGateway,
      useClass: StoresService
    }
  ]
})
export class AdminModule { }
