import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumbersTwoDecimals]'
})
export class NumbersTwoDecimalsDirective {
  // Allow decimal numbers and negative values
  private regex: RegExp = new RegExp(/^\d*\.?\d{0,2}$/g);
  // Allow key codes for special events. Reflect :
  // Backspace, tab, end, home
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event) {
    // Allow Backspace, tab, end, and home keys
    //event.target.placeholder = "UNDEFINED";

    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    //let current: string = this.el.nativeElement.value;
    //const position = this.el.nativeElement.selectionStart;
    //const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
    const current: string = this.el.nativeElement.value;
    const next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event){
    let pastedText = event.clipboardData.getData('text');
    if (!String(pastedText).match(this.regex)) {
      event.target.placeholder = "ERROR AL COPIAR";
      event.preventDefault();
    }
  }

  @HostListener('blur', ['$event'])
  blur(event){
    //event.target.placeholder = "UNDEFINED";
    if (event.target.value === "" || !String(event.target.value).match(this.regex)) {
      //event.target.value = 0;
      return;
    }else if(event.target.value === "."){
      //event.target.value = "";
      return;
    }else if(event.target.value.charAt(0) === "." && event.target.value.length > 1){
      event.target.value = '0' + event.target.value;
      return;
    }
  }
}
