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

import { ResizeService } from '../../core/util/resize.service';
import { buildMonthNamesAndShortYear } from '../../core/util/date';

@Component({
  selector: 'my-org-chart-line',
  standalone: true,
  imports: [],
  templateUrl: './chart-line.component.html',
  styleUrl: './chart-line.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartLineComponent {
  private ngZone = inject(NgZone);
  private destroyRef = inject(DestroyRef);
  private resizeService = inject(ResizeService);

  chart: Chart | undefined;
  label = input.required<string>();
  data = input.required<number[]>();
  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  constructor() {
    effect(() => {
      this.resizeService.resize();
      const canvas = this.canvas();
      const data = this.data();
      const label = this.label();
      this.ngZone.runOutsideAngular(() => {
        this.buildChart(canvas.nativeElement, data, label);
      });
    });
    this.destroyRef.onDestroy(() => this.chart?.destroy());
  }

  private buildChart(canvas: HTMLCanvasElement, data: number[], label: string) {
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
