import { Component, signal } from '@angular/core';

import { Navbar } from "./shared/components/navbar/navbar";
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('08-maps-app');
}
