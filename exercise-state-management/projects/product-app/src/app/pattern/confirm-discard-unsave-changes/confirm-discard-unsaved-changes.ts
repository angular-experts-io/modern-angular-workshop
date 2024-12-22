import { AbstractControl } from '@angular/forms';
import { inject } from '@angular/core';

import { DialogConfirmService } from '../dialog-confirm/dialog-confirm.service';

export function confirmDiscardUnsavedChanges(form: AbstractControl) {
  if (form.dirty) {
    return inject(DialogConfirmService).open$({
      title: 'Discard unsaved changes?',
      message: 'Are you sure you want to discard unsaved changes?',
      isInfo: true,
    });
  }
  return true;
}
