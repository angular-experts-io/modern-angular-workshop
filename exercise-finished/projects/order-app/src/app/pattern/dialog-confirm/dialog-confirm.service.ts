import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { DialogConfirmComponent } from './dialog-confirm.component';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';

export interface DialogConfirmData {
  title: string;
  message: string;
  confirmLabel: string;
}

@Injectable({
  providedIn: 'root',
})
export class DialogConfirmService {
  private matDialog = inject(MatDialog);
  private scrollStrategyOptions = inject(ScrollStrategyOptions);

  open(data: { title: string; message: string; confirmLabel: string }) {
    const dialogRef = this.matDialog.open<
      DialogConfirmComponent,
      DialogConfirmData,
      boolean
    >(DialogConfirmComponent, {
      data,
      width: '350px',
      disableClose: true,
      scrollStrategy: this.scrollStrategyOptions.noop(),
    });

    return dialogRef.afterClosed();
  }
}
