import { Component, ElementRef, inject, input, signal, viewChild } from '@angular/core';
import maplibregl, { LngLatLike, Marker } from 'maplibre-gl';

/**
 * width 100%
 * height 260
 *
 */
@Component({
  selector: 'app-minimap',
  imports: [],
  templateUrl: './minimap.html',
})
export class Minimap {

  mapDiv = viewChild<ElementRef<HTMLDivElement>>('map');
  mapSignal = signal<maplibregl.Map | null>(null);
  coordenadas = input.required<LngLatLike>();

  markers = signal<Marker[]>([]);

  async ngAfterViewInit() {
    const el = this.mapDiv()?.nativeElement;
    if (!el) return;

    const map = new maplibregl.Map({
      container: el,
      style: 'https://api.maptiler.com/maps/base-v4/style.json?key=KvxcfYAoc3Dudtb1gLQ3', // alternativa estable al globe.json', // alternativa estable al globe.json
      center: this.coordenadas(),
      zoom: 17,
      interactive: false,        // bloquea drag, zoom, rotación, teclado, etc.
      pitchWithRotate: false,


    });
    if (!this.mapSignal) return;

    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );
    const marker = new maplibregl.Marker({

      draggable: false,
      color: color
    }).setLngLat(this.coordenadas()).addTo(map);


    this.mapSignal.set(map);

  }

}
