import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ANIMATION_TIME_AND_EASING } from './animation.const';

export const animationAppear = trigger('appear', [
  state('false', style({ opacity: 0 })),
  state('true', style({ opacity: 1 })),
  transition('false <=> true', animate(ANIMATION_TIME_AND_EASING)),
]);
