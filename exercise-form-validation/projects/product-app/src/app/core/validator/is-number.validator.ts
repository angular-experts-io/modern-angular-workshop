import { AbstractControl, ValidationErrors } from '@angular/forms';

// it's a good practice to implement validators as factory functions
// because in the future, we might need to extend them by passing parameters
export function isNumberValidator() {
  return (control: AbstractControl): ValidationErrors | null => {
    // TODO 24: let's implement a custom "isNumber" validator for the price and quantity fields

    // if control value is null, let's return null (no error)
    // every validator has the same clause in order to work in conjunction with required validator
    if (!control.value) {
      return null;
    }


    // check if the control value is NOT a number by using isNaN(parseFloat(control.value))
    // if it's not a number, let's return an object with the "isNumber" key
    // and an object with current value as a value property
    // which is a data structure expected by Angular forms to process validation errors
    // else if it IS a number, let's return null (no error)
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
