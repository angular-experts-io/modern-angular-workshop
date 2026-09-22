import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { MatAnchor } from '@angular/material/button';

@Component({
  selector: 'my-org-main-layout',
  imports: [RouterLink, RouterOutlet, MatToolbar, MatAnchor],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  navigation = signal([
    { label: 'Home', path: '/home' },
    { label: 'Products', path: '/product' },
  ])
}
