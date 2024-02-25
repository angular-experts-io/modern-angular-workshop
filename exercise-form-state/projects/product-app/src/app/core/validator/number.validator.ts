import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// it's a good practice to implement validators as factory functions
// because in the future, we might need to extend them by passing parameters
export function numberValidator(): ValidatorFn {
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

export function isIntegerValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    const maybeNumber = parseFloat(control.value);
    if (!isNaN(maybeNumber) && !Number.isInteger(maybeNumber)) {
      return {
        isInteger: {
          value: control.value,
        },
      };
    } else {
      return null;
    }
  };
}
