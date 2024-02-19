import { inject } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { DialogConfirmService } from '../dialog-confirm/dialog-confirm.service';

export function confirmDiscardUnsavedChanges(form: AbstractControl) {
  const dialogConfirmService = inject(DialogConfirmService);
  if (form.dirty) {
    return dialogConfirmService.open$({
      title: 'Confirm discard data',
      message:
        'Are you sure you want to leave form without saving the changes?',
      isInfo: true,
    });
  } else {
    return true;
  }
}
