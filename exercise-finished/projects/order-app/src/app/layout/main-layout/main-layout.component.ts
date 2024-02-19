import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'my-org-main-layout',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {
  navigation = [
    { route: 'home', label: 'Home' },
    { route: 'product', label: 'Product' },
    {
      route: 'product-service-store-like',
      label: 'Product (Service, "store like")',
    },
    { route: 'product-store-signals', label: 'Product (Signals Store)' },
  ];
}
