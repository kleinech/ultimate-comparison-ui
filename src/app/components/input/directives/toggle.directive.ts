import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[toggle]',
  exportAs: 'toggle'
})
export class ToggleDirective {
  @Input() toggle = false;

  @HostListener('closed') closed() {
    this.toggle = false;
  }

  @HostListener('opened') opened() {
    this.toggle = true;
  }
}
