import { Component } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {
  icon!: string;
  title = '';
  message = '';
  cancelBtn = true;
  constructor( protected ref: NbDialogRef<ConfirmDialogComponent> ) {}

}
