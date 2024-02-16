import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// always implemented as factory ( can be extended by passing parameters )
// without breaking the existing consumers in the future
export function isNumberValidator(): ValidatorFn {
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
  };
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
