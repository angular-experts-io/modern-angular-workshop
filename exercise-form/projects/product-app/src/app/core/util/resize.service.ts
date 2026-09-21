import { inject, Service, NgZone } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { asyncScheduler, fromEvent, throttleTime } from 'rxjs';

@Service()
export class ResizeService {
  resize = inject(NgZone).runOutsideAngular(() =>
    toSignal(
      fromEvent(window, 'resize').pipe(
        throttleTime(400, asyncScheduler, { trailing: true, leading: true }),
      ),
    ),
  );
}
