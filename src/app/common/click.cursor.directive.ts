import { Directive, ElementRef, HostBinding } from '@angular/core';

@Directive({
  selector: '[click]'
})
export class ClickCursorDirective {

  constructor(private el: ElementRef) { }

  @HostBinding('style.cursor') cursor: string = 'pointer';

}
