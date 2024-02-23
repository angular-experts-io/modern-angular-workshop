import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'my-org-chart-line',
  standalone: true,
  imports: [],
  templateUrl: './chart-line.component.html',
  styleUrl: './chart-line.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartLineComponent {

}
