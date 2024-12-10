import { Chart } from 'chart.js/auto';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { buildMonthNamesAndShortYear } from '../../core/util/date';

@Component({
  selector: 'my-org-chart-line',
  imports: [],
  templateUrl: './chart-line.component.html',
  styleUrl: './chart-line.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartLineComponent {
  chart: Chart | undefined;

  // TODO 1: let's define two required inputs, label:string  and data:number[]

  // TODO 4: let's get a hold of the canvas element using new viewChild signal query and store it in canvas property
  // the locator of the query will be the name of the template variable
  // the viewChild should be required and let's also provide generic type of ElementRef<HTMLCanvasElement>

  // TODO 5: let's create an effect that will re-create the chart when the data or label changes
  // how can we specify effects in components (what are the tradeoffs of each approach)?
  // the effect should unwrap values of label, data and canvas into variables
  // and pass them into provided buildChart method (see impl at the end of this file)
  // we should see the chart in the running application when we open the product detail page

  // TODO 6: let's try to resize browser window and pay attention to the change detection counter
  // in the top left corner of the application, does it change when we resize the window?
  // not only it changes, it changes a lot because of some logic within the chart.js library
  // lets fix this by injecting NgZone and wrapping the buildChart() method with runOutsideAngular
  // let's try to resize the window again and see if the change detection counter changes

  // TODO 7: another issue with using components from 3rd party libraries is that their instance will
  // not be destroyed together with the parent Angular component which will lead to memory leaks
  // let's fix that by calling chart.destroy() method when the component is destroyed
  // let's do it the new modern way by injecting DestroyRef and calling onDestroy method
  // instead of specifying ngOnDestroy lifecycle hook handler
  // where is the appropriate place to register the destroyRef.onDestroy handler?

  // TODO 8: if we try to resize the window now, we will see that the chart size not being updated
  // which leads to broken UI under certain conditions, let's fix that by creating a new
  // "resize" service in the core/util/ folder and injecting it into the "chart-line" component
  // (injecting a service from core is also the reason why is this component implemented in the pattern folder)
  // in the ResizeService, let's create resize signal which is going to be based on the
  // RxJs fromEvent(window, 'resize') observable and throttleTime(500) operator
  // What RxJs / signals interop function should we use to convert the observable to a signal?

  // TODO 9: let's use the resize signal in this component to re-create the chart when the window is resized
  // where should we access the resize signal in this component to achieve this behavior?

  // TODO 10: let's try to resize the window now and see if the chart is resized to fit the container
  // now pay attention to the change detection counter in the top left corner of the application
  // again, using RxJs stream of resize event causes too many change detection cycles
  // let's fix that in the service itself by injecting NgZone and wrapping the resize signal
  // with runOutsideAngular as well as parameterizing the throttleTime operator 2 additional arguments,
  // asyncScheduler and { trailing: true } to get the last event when the user stops resizing the window
  // the runOutsideAngular returns whatever was called inside the function so we just wrap the toSignal call
  // and it should work as expected because the return type will stay the same, Signal<Event|undefined>
  // now the resizing behavior as well as the change detection counter should be fixed!

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
    setTimeout(() => {
      if (this.chart) {
        this.chart.resize();
      }
    }, 50);
  }
}
