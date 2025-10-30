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
  }));

  pageTitle$ = this.router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    tap((event) => console.log(event)),
    map((event) => event.url)

  );
}


