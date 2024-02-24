import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ANIMATION_TIME_AND_EASING } from './animation.const';

export const appearDownAnimation = trigger('appearDown', [
  state('false', style({ opacity: 0, transform: 'translateY(-20px)' })),
  state('true', style({ opacity: 1, transform: 'translateY(0px)' })),
  transition('false <=> true', animate(ANIMATION_TIME_AND_EASING)),
]);

export const appearDownEnterLeaveAnimation = trigger('appearDownEnterLeave', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-15px)' }),
    animate(
      ANIMATION_TIME_AND_EASING,
      style({ opacity: 1, transform: 'translateY(0px)' }),
    ),
  ]),
  transition(':leave', [
    animate(
      ANIMATION_TIME_AND_EASING,
      style({ opacity: 0, transform: 'translateY(-15px)' }),
    ),
  ]),
]);
