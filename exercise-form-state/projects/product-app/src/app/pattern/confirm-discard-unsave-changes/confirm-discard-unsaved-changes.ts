// TODO 18: Let's improve UX even more by adding a guard to confirm if the user
// wants to discard unsaved changes when leaving form which is in a dirty state
// we're going to use inline functional guard but we still want to prepare a pattern
// which will be called by the guard to abstract away shared logic

// let's create a"confirmDiscardUnsavedChanges" function which will accept a form (with AbstractControl type)
// inside the function were going to check it the provided form is dirty
// if it is dirty we're going to inject DialogConfirmService and use its open$ method to open a dialog
// (the inline injection works because guards run in the injection context)
// the call will be parametrized with title, message, and isInfo flag
// we're going to return the result of the open$ method
// if the form is not dirty we're going to return true
