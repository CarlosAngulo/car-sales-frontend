import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from './dropdown/dropdown.component';
import { NbAutocompleteModule, NbInputModule } from '@nebular/theme';
import { UserNamePipe } from './pipes/username.pipe';
import { BooeanToStringPipe } from './pipes/boolean.pipe';
import { DropdownOptionPipe } from './pipes/dropdown-option.pipe';

@NgModule({
  declarations: [
    DropdownComponent,
    BooeanToStringPipe,
    UserNamePipe,
    DropdownOptionPipe,
  ],
  imports: [
    CommonModule,
    NbInputModule,
    NbAutocompleteModule,
  ],
  exports: [
    DropdownComponent,
    BooeanToStringPipe,
    UserNamePipe,
    DropdownOptionPipe,
  ]
})
export class SharedModule { }
