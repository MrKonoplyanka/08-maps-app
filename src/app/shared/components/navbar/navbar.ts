import { Component, inject } from '@angular/core';
import { routes } from '../../../app.routes';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [AsyncPipe,RouterLink],
  templateUrl: './navbar.html',

})
export class Navbar {


  router = inject(Router);
  routes = routes.map((route) => ({
    path: route.path,
    title: `${route.title ?? 'Maps en Angular'}`,
  })).filter(route => route.path!== '**');

  pageTitle$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    tap((event) => console.log(event)),
    map((event) => event.url),
    map((url) => routes.find(route=> `/${route.path}`=== url)?.title ?? 'No tiene título')

  );

  getTitle():string{


    return '';
  }
}
