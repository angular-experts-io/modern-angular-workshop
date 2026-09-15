import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CdCounterComponent } from './cd-counter.component';

@Component({
  selector: 'my-org-test-render-child',
  template: '<span>{{ value() }}</span>',
})
class RenderChild {
  value = signal(0);
}

@Component({
  selector: 'my-org-test-counter-host',
  imports: [CdCounterComponent, RenderChild],
  template: '<my-org-cd-counter /><my-org-test-render-child />',
})
class CounterHost {}

describe('CdCounterComponent', () => {
  it('counts sibling renders under an OnPush root without causing extra renders', async () => {
    const fixture = TestBed.createComponent(CounterHost);
    await fixture.whenStable();
    const child = fixture.debugElement.query(By.directive(RenderChild))
      .componentInstance as RenderChild;
    const count = () =>
      Number(
        fixture.nativeElement.querySelector('my-org-cd-counter span span').textContent,
      );
    const initialCount = count();
    expect(initialCount).toBe(1);

    child.value.set(1);
    await fixture.whenStable();

    expect(
      fixture.nativeElement.querySelector('my-org-test-render-child').textContent,
    ).toBe('1');
    expect(count()).toBe(initialCount + 1);
    await new Promise((resolve) => setTimeout(resolve, 50));
    await fixture.whenStable();
    expect(count()).toBe(initialCount + 1);
  });

  it('resets on click and Escape and counts the render caused by the reset event', async () => {
    const fixture = TestBed.createComponent(CounterHost);
    await fixture.whenStable();
    const counter = fixture.nativeElement.querySelector(
      'my-org-cd-counter > span',
    ) as HTMLSpanElement;
    const count = () => counter.querySelector('span')!.textContent;

    for (const event of [
      new MouseEvent('click'),
      new KeyboardEvent('keyup', { key: 'Escape' }),
    ]) {
      counter.dispatchEvent(event);
      expect(count()).toBe('0');
      await fixture.whenStable();
      expect(count()).toBe('1');
    }
  });

  it('stops observing renders when destroyed', async () => {
    const fixture = TestBed.createComponent(CounterHost);
    await fixture.whenStable();
    const target = fixture.nativeElement.querySelector(
      'my-org-cd-counter span span',
    ) as HTMLSpanElement;
    const lastCount = target.textContent;
    fixture.destroy();

    const otherFixture = TestBed.createComponent(RenderChild);
    await otherFixture.whenStable();
    expect(target.textContent).toBe(lastCount);
  });
});
