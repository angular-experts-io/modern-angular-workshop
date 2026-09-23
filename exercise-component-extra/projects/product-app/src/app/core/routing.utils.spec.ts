import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Navigation, provideRouter, Router, ViewTransitionInfo } from '@angular/router';

import { skipQueryOnlyTransition } from './routing.utils';

@Component({ template: '' })
class TestPage {}

describe('skipQueryOnlyTransition', () => {
  it.each([
    ['/product/coffee?query=beans', true],
    ['/product/coffee#prices', true],
    ['/product/grinder', false],
    ['/product/coffee;mode=edit', false],
  ])('handles navigation to %s (skip: %s)', async (target, shouldSkip) => {
    TestBed.configureTestingModule({
      providers: [provideRouter([{ path: 'product/:id', component: TestPage }])],
    });
    const router = TestBed.inject(Router);
    await router.navigateByUrl('/product/coffee');
    vi.spyOn(router, 'currentNavigation').mockReturnValue({
      finalUrl: router.parseUrl(target),
    } as Navigation);
    const skipTransition = vi.fn();
    TestBed.runInInjectionContext(() =>
      skipQueryOnlyTransition({
        transition: { skipTransition },
      } as unknown as ViewTransitionInfo),
    );
    expect(skipTransition).toHaveBeenCalledTimes(shouldSkip ? 1 : 0);
  });
});
