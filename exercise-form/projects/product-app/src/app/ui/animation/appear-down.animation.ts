import { animate, state, style, transition, trigger } from '@angular/animations';

export const appearDownEnterLeave = trigger('appearDownEnterLeave', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-10px)' }),
    animate('300ms', style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
  transition(':leave', [animate('300ms', style({ opacity: 0, transform: 'translateY(-10px)' }))]),
]);

export const appearDown = trigger('appearDown', [
  state('false', style({ opacity: 0, transform: 'translateY(-10px)' })),
  state('true', style({ opacity: 1, transform: 'translateY(0)' })),
  transition('true <=> false', animate('300ms')),
]);
