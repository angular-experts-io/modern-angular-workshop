import { RouterLink } from '@angular/router';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

import { CardComponent } from '../../../ui/card/card.component';
import { buildMonthNamesAndShortYear } from '../../../core/util/date';

@Component({
  selector: 'my-org-product-editor',
  standalone: true,
  imports: [RouterLink, MatIcon, MatIconButton, CardComponent, CardComponent],
  templateUrl: './product-editor.component.html',
  styleUrl: './product-editor.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductEditorComponent {
  MONTHS = buildMonthNamesAndShortYear().reverse();

  productId = input<string>();
}
