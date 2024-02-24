import { inject, Injectable, NgZone, Signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { asyncScheduler, fromEvent, throttleTime } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ResizeService {
  #ngZone = inject(NgZone);

  resize = this.#ngZone.runOutsideAngular(() =>
    toSignal(fromEvent(window, 'resize').pipe(throttleTime(500))),
  );
}
