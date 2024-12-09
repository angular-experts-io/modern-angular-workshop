import { Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';
import { A11yModule } from '@angular/cdk/a11y';

import { DialogConfirmData } from './dialog-confirm.service';

@Component({
  selector: 'my-org-dialog-confirm',
  imports: [
    A11yModule,
    MatButton,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './dialog-confirm.component.html',
  styleUrl: './dialog-confirm.component.scss',
})
export class DialogConfirmComponent {
  #dialogRef = inject(MatDialogRef<DialogConfirmComponent>);

  data = inject<DialogConfirmData>(MAT_DIALOG_DATA);

  onConfirm() {
    this.#dialogRef.close(true);
  }

  onCancel() {
    this.#dialogRef.close(false);
  }
}
