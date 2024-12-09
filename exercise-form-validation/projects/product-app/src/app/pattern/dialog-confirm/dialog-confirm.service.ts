import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';

import { DialogConfirmComponent } from './dialog-confirm.component';

export interface DialogConfirmData {
  title: string;
  message: string;
  confirmLabel?: string;
  isInfo?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class DialogConfirmService {
  #matDialog = inject(MatDialog);
  #scrollStrategyOptions = inject(ScrollStrategyOptions);

  open(data: DialogConfirmData, resultHandler: (result: boolean) => void) {
    return this.open$(data).subscribe((result) =>
      resultHandler(result ?? false),
    );
  }

  open$(data: DialogConfirmData) {
    const dialogRef = this.#matDialog.open<
      DialogConfirmComponent,
      DialogConfirmData,
      boolean
    >(DialogConfirmComponent, {
      data,
      width: '350px',
      disableClose: true,
      scrollStrategy: this.#scrollStrategyOptions.noop(),
    });

    return dialogRef.afterClosed();
  }
}
