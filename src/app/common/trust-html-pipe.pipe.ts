import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'TrustHtmlPipe',
  pure: true // This allows the pipe to only run once
})
export class TrustHtmlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {
  }

  transform(pUnsafe: string) {
      return this.sanitizer.bypassSecurityTrustHtml(pUnsafe);
  }

}
