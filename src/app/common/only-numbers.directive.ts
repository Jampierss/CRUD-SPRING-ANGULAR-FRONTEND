import { Directive, ElementRef, HostListener,Input } from '@angular/core';

@Directive({
  selector: '[appOnlyNumbers]'
})
export class OnlyNumbersDirective {
  private regex: RegExp = new RegExp(/^\d*$/g);
  private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];
  private placeholder:string = "";

  @Input() blnMaxValue:boolean = false;
  @Input() maxValue:number = 0;
  

  constructor(private el: ElementRef) {
  }
  @HostListener('keydown', ['$event'])
  onKeyDown(event) {
    //event.target.placeholder = this.placeholder;

    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }

    let current: string = this.el.nativeElement.value;
    //const position = this.el.nativeElement.selectionStart;
    const next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
    if(next && Number(next) == 0){
      event.preventDefault();
      event.target.value = 0;
    }

    this.validarMaximo(event,next);
  }

  @HostListener('paste', ['$event'])
  onPaste(event){
    let pastedText = event.clipboardData.getData('text');
    if (!String(pastedText).match(this.regex)) {
      //event.target.placeholder = this.placeholder;
      event.preventDefault();
      event.target.value = "";
    }
    this.validarMaximo(event,pastedText);
  }

  @HostListener('blur', ['$event'])
  blur(event){
    //event.target.placeholder = this.placeholder;
    if (event.target.value === "" || !String(event.target.value).match(this.regex)) {
      event.target.value = "";
    }
  }

  validarMaximo(event:any,valor:string):void{
    if(this.blnMaxValue && Number(valor)>this.maxValue){
      //event.target.placeholder = `MAX:${this.maxValue}`;
      event.preventDefault();
      event.target.value = "";
    }
  }
}
