import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatAnchor } from '@angular/material/button';

@Component({
  selector: 'my-org-main-layout',
  standalone: true,
  imports: [RouterLink, RouterOutlet, MatToolbar, MatAnchor],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {
  navigation = signal([
    {
      route: 'home',
      label: 'Home',
    },
    {
      route: 'product',
      label: 'Product',
    },
  ]);
}
