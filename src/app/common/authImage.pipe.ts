import { Pipe, PipeTransform } from '@angular/core';
import { Observable} from 'rxjs';
import { AuthService } from '../usuarios/auth.service';

@Pipe({
  name: 'authImage'
})
export class AuthImagePipe implements PipeTransform {

  constructor(
    private authService:AuthService,
  ) {}

  transform(src: string): Observable<string> {
    return this.authService.getImage(src);
  }
}
