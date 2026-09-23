import { inject } from '@angular/core';
import { Router, ViewTransitionInfo } from '@angular/router';

export function skipQueryOnlyTransition({ transition }: ViewTransitionInfo) {
  const router = inject(Router);
  const targetUrl = router.currentNavigation()!.finalUrl!;

  if (
    router.isActive(targetUrl, {
      paths: 'exact',
      matrixParams: 'exact',
      queryParams: 'ignored',
      fragment: 'ignored',
    })
  ) {
    transition.skipTransition();
  }
}
