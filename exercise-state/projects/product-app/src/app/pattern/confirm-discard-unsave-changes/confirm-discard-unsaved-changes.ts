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
  return false;
}

// let's create a"confirmDiscardUnsavedChanges" function which will accept a form (with AbstractControl type)
// inside the function were going to check it the provided form is dirty
// if it is dirty we're going to inject DialogConfirmService and use its open$ method to open a dialog
// (the inline injection works because guards run in the injection context)
// the call will be parametrized with title, message, and isInfo flag
// we're going to return the result of the open$ method
// if the form is not dirty we're going to return true
