import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'my-org-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
