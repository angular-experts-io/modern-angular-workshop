import { AbstractControl, ValidationErrors } from '@angular/forms';

// it's a good practice to implement validators as factory functions
// because in the future, we might need to extend them by passing parameters
export function isNumberValidator() {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    if (isNaN(parseFloat(control.value))) {
      return {
        isNumber: {
          value: control.value,
        },
      };
    } else {
      return null;
    }
  }
}
