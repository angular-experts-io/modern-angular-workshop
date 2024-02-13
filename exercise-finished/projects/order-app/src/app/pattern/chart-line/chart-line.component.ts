import { Chart } from 'chart.js/auto';
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  NgZone,
  OnDestroy,
  signal,
  ViewChild,
} from '@angular/core';

import { ResizeService } from '../../core/util/resize.service';

@Component({
  selector: 'my-org-chart-line',
  standalone: true,
  imports: [],
  templateUrl: './chart-line.component.html',
  styleUrl: './chart-line.component.scss',
})
export class ChartLineComponent implements AfterViewInit, OnDestroy {
  private ngZone = inject(NgZone);
  private resizeService = inject(ResizeService);

  label = input.required<string>();
  data = input.required<number[]>();

  chart: Chart | undefined;

  @ViewChild('canvas') _canvas!: ElementRef<HTMLCanvasElement>;
  canvas = signal<HTMLCanvasElement | undefined>(undefined);

  constructor() {
    effect(() => {
      this.resizeService.resize();
      const canvas = this.canvas();
      const data = this.data();
      const label = this.label();

      if (!canvas) {
        return;
      }

      this.ngZone.runOutsideAngular(() => {
        this.buildChart(canvas, data, label);
      });
    });
  }

  ngAfterViewInit() {
    this.canvas.set(this._canvas.nativeElement);
  }

  ngOnDestroy() {
    this.chart?.destroy();
  }

  private buildChart(canvas: HTMLCanvasElement, data: number[], label: string) {
    this.chart?.destroy();
    this.chart = undefined;
    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: this.buildMonthNamesAndShortYear(),
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

  private buildMonthNamesAndShortYear() {
    return Array.from(Array(12).fill(0), (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return (
        date.toLocaleString('default', { month: 'short' }) +
        ' ' +
        date.getFullYear().toString().slice(-2)
      );
    }).reverse();
  }
}
