import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'inventario-app';

  newTitle: string;  
  defaultTitle: string  = 'Farmacia Universal';

  constructor(private router: Router,
              private route: ActivatedRoute,
              private titleService: Title) {
    const navEndEvents$ = this.router.events
                .pipe(
                  filter(event => event instanceof NavigationEnd)
                ).subscribe((event: NavigationEnd) =>{
                  this.newTitle = this.route.root.firstChild.snapshot.data.title?this.route.root.firstChild.snapshot.data.title:this.defaultTitle;
                  this.titleService.setTitle(this.newTitle);
                })
  }
}
