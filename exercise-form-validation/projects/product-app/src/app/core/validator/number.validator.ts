import { AbstractControl, ValidationErrors } from '@angular/forms';

// it's a good practice to implement validators as factory functions
// because in the future, we might need to extend them by passing parameters
export function isNumberValidator() {
  return (control: AbstractControl): ValidationErrors | null => {
    // TODO 3: let's implement a custom "isNumber" validator for the price and pricePerMonth fields

    // if control value is empty (empty string or null), let's return null (no error)
    // (every validator uses the same condition in order to work in conjunction with the required validator)

    // check if the control value is NOT a number by using isNaN(parseFloat(control.value))
    // if it's not a number, let's return an object with the "isNumber" key
    // and an object with current value as a value property
    // which is a data structure expected by Angular forms to process validation errors
    // else if it IS a number, let's return null (no error)

    return null;
  };
}

export function isIntegerValidator() {
  return (control: AbstractControl): ValidationErrors | null => {
    // TODO 4: let's implement a custom "isInteger" validator for the quantity field
    // it's going to be have the same logic as the "isNumber" validator
    // but additionally we're going to check if the number
    // is an integer by using Number.isInteger method

    return null;
  };
}
