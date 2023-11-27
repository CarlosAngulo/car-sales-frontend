import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from './dropdown/dropdown.component';
import { NbAutocompleteModule, NbButtonModule, NbCardModule, NbIconModule, NbInputModule } from '@nebular/theme';
import { UserNamePipe } from './pipes/username.pipe';
import { BooeanToStringPipe } from './pipes/boolean.pipe';
import { DropdownOptionPipe } from './pipes/dropdown-option.pipe';
import { PaginationComponent } from './pagination/pagination.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    DropdownComponent,
    BooeanToStringPipe,
    UserNamePipe,
    DropdownOptionPipe,
    PaginationComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    CommonModule,
    NbInputModule,
    NbAutocompleteModule,
    NbCardModule,
    NbButtonModule,
    NbIconModule,
  ],
  exports: [
    DropdownComponent,
    PaginationComponent,
    BooeanToStringPipe,
    UserNamePipe,
    DropdownOptionPipe,
    ConfirmDialogComponent
  ]
})
export class SharedModule { }
