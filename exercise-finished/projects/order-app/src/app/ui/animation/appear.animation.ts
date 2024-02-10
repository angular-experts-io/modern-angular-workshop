import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

export const appearAnimation = trigger('appear', [
  state('false', style({ opacity: 0 })),
  state('true', style({ opacity: 1 })),
  transition('false <=> true', animate('0.2s ease-in-out')),
]);
