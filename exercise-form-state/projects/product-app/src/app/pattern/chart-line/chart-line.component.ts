import { Chart } from 'chart.js/auto';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  NgZone,
  viewChild,
} from '@angular/core';

import { buildMonthNamesAndShortYear } from '../../core/util/date';
import { ResizeService } from '../../core/util/resize.service';

@Component({
  selector: 'my-org-chart-line',
  imports: [],
  templateUrl: './chart-line.component.html',
  styleUrl: './chart-line.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartLineComponent {
  #ngZone = inject(NgZone);
  #destroyRef = inject(DestroyRef);
  #resizeService = inject(ResizeService);

  chart: Chart | undefined;

  label = input.required<string>();
  data = input.required<number[]>();

  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  #effectRebuildChartOnChange = effect(() => {
    this.#resizeService.resize();
    const canvas = this.canvas();
    const data = this.data();
    const label = this.label();
    this.#ngZone.runOutsideAngular(() => {
      this.#buildChart(canvas.nativeElement, data, label);
    });
  });

  #destroyChartOnDestroy = this.#destroyRef.onDestroy(() =>
    this.chart?.destroy(),
  );

  #buildChart(canvas: HTMLCanvasElement, data: number[], label: string) {
    this.chart?.destroy();
    this.chart = undefined;
    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: buildMonthNamesAndShortYear().slice(0, data.length).reverse(),
        datasets: [
          {
            label,
            data,
            animation: false,
            fill: false,
            pointBorderWidth: 3,
            borderColor: '#3764ea',
            tension: 0,
          },
        ],
      },
    });
  }
}
