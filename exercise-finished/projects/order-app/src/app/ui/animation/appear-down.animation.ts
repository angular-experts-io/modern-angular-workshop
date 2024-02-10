import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const appearDownAnimation = trigger('appearDown', [
  state('false', style({ opacity: 0, transform: 'translateY(-20px)' })),
  state('true', style({ opacity: 1, transform: 'translateY(0px)' })),
  transition('false <=> true', animate('0.2s ease-in-out')),
]);
