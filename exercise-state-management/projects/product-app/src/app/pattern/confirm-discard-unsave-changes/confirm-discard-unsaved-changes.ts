import { inject } from '@angular/core';
import { FieldTree } from '@angular/forms/signals';

import { DialogConfirmService } from '../dialog-confirm/dialog-confirm.service';

export function confirmDiscardUnsavedChanges(form: FieldTree<unknown>) {
  if (form().dirty()) {
    return inject(DialogConfirmService).open$({
      title: 'Discard unsaved changes?',
      message: 'Are you sure you want to discard unsaved changes?',
      isInfo: true,
    });
  }
  return true;
}
