import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

// TODO 15: Create a new "appearDownEnterLeave" animation
// which will animate the opacity and transform properties of an element

// the animations will be stored in the const with its name
// do not hesitate to consult the documentation for more information
// the animation trigger will be called "appearDownEnterLeave" and it will have two transitions
// the first transition will be for the ":enter" and ":leave"
// the ":enter" transition will have a style with opacity set to 0 and transform to translateY(-10px)
// the ":enter" transition will have an animate function with a duration of 300ms
// the animate function will have a style with opacity set to 1 and transform to translateY(0)
// the ":leave" transition will have an animate function with a duration of 300ms
// the animate function will have a style with opacity set to 0 and transform to translateY(-10px)
// then ":enter" and ":leave" based transitions work great with @if blocks

// TODO 17: Create a new "appearDown" animation
// which will animate the opacity and transform properties of an element

// the animations will be stored in the const with its name
// do not hesitate to consult the documentation for more information
// the animation trigger will be called "appearDown" and it will have two states
// the first state will be for the "false" state, and it will have a style with opacity set to 0 and transform to translateY(-10px)
// the second state will be for the "true" state, and it will have a style with opacity set to 1 and transform to translateY(0)
// the last one will be the "transition" between "true <=> false" states with animate function with a duration of 300ms
