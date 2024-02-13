import { inject, Injectable, NgZone, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { asyncScheduler, fromEvent, throttleTime } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResizeService {
  private ngZone = inject(NgZone);

  resize!: Signal<Event | undefined>;

  constructor() {
    this.ngZone.runOutsideAngular(() => {
      this.resize = toSignal(
        fromEvent(window, 'resize').pipe(
          throttleTime(500, asyncScheduler, { trailing: true }),
        ),
      );
    });
  }
}
