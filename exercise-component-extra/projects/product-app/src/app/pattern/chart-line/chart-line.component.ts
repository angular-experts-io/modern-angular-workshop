import { Chart } from 'chart.js/auto';
import { Component } from '@angular/core';

import { buildMonthNamesAndShortYear } from '../../core/util/date';

@Component({
  selector: 'my-org-chart-line',
  imports: [],
  templateUrl: './chart-line.component.html',
  styleUrl: './chart-line.component.scss',
})
export class ChartLineComponent {
  chart: Chart | undefined;

  // TODO 1: let's define two required inputs, label:string  and data:number[]

  // TODO 4: let's get a hold of the canvas element using new viewChild signal query and store it in canvas property
  // the locator of the query will be the name of the template variable
  // the viewChild should be required and let's also provide generic type of ElementRef<HTMLCanvasElement>


  // TODO 5: let's create an "afterRenderEffect" that will re-create the chart when the data or label changes
  // how can we specify effects (and afterRenderEffect) in components (what are the tradeoffs of each approach)?
  // the afterRenderEffect should unwrap values of label, data and canvas into variables
  // and pass them into provided buildChart method (see impl at the end of this file),
  // it should only react to canvas, label and data changes
  // we should see the chart in the running application when we open the product detail page
  // what would happen if we used the "effect" signal instead of "afterRenderEffect" here?

  // TODO 6: if we try to resize the window, we will see that the chart size not being updated
  // which leads to broken UI under certain conditions, let's fix that by creating a new
  // "resize" service in the core/util/ folder and injecting it into the "chart-line" component
  // use @Service() to make ResizeService a global singleton
  // (injecting a service from core is also the reason why is this component implemented in the pattern folder)
  // in the ResizeService, let's create resize signal which is going to be based on the
  // RxJs fromEvent(window, 'resize') observable and throttleTime operator
  // with following arguments, 500ms, undefined and { trailing: true } to always get the
  // last event when the user stops resizing the window
  // What RxJs / signals interop function should we use to convert the observable to a signal?

  // TODO 7: let's use the resize signal in this component to resize the chart when the window is resized
  // we're going to create a new effect that will call the "#resizeChart()" method (already prepared)
  // how do we trigger this effect ?

  // TODO 8: let's try to resize browser window and pay attention to the change detection counter
  // in the top left corner of the application, does it change when we resize the window?
  // it changes, but not too much because we're using "zoneless" change detection (default as of Angular 21)

  // TODO 9: (optional) many existing Angular applications still use Zone.js for change detection
  // which would lead to excessive amount of change detection and runtime performance degradation
  // let's learn how to fix that in the service itself by injecting NgZone and wrapping the resize signal
  // with runOutsideAngular
  // the runOutsideAngular returns whatever was called inside the function so we just wrap the toSignal call
  // and it should work as expected because the return type will stay the same, Signal<Event|undefined>

  // TODO 10: another issue with using components from 3rd party libraries is that their instance will
  // not be destroyed together with the parent Angular component which will lead to memory leaks
  // let's fix that by calling chart.destroy() method when the component is destroyed
  // let's do it the new modern way by injecting DestroyRef and calling onDestroy method
  // instead of specifying ngOnDestroy lifecycle hook handler
  // where is the appropriate place to register the destroyRef.onDestroy handler?

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
