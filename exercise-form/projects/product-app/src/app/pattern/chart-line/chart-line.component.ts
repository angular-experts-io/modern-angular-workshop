import { Chart } from 'chart.js/auto';
import {
  afterRenderEffect,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';

import { buildMonthNamesAndShortYear } from '../../core/util/date';
import { ResizeService } from '../../core/util/resize.service';

@Component({
  selector: 'my-org-chart-line',
  templateUrl: './chart-line.component.html',
  styleUrl: './chart-line.component.scss',
})
export class ChartLineComponent {
  #resizeService = inject(ResizeService);

  chart: Chart | undefined;

  label = input.required<string>();
  data = input.required<number[]>();

  canvas = viewChild.required<ElementRef<HTMLCanvasElement>>('canvas');

  #destroyChartOnDestroy = inject(DestroyRef).onDestroy(() =>
    this.chart?.destroy(),
  );

  #effectRebuildChartOnChange = afterRenderEffect(() => {
    this.#resizeService.resize();
    const canvas = this.canvas();
    const data = this.data();
    const label = this.label();
    this.#buildChart(canvas.nativeElement, data, label);
  });

  #effectResizeChart = effect(() => {
    this.#resizeService.resize();
    this.#resizeChart();
  })

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

  #resizeChart() {
    setTimeout(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 50);
  }
}
