
import { JsonPipe, DecimalPipe } from '@angular/common';
import { AfterViewInit, Component, effect, ElementRef, signal, viewChild } from '@angular/core';
import maplibregl from 'maplibre-gl';



@Component({
  selector: 'app-fullscreen-map-page',
  imports: [JsonPipe, DecimalPipe],
  templateUrl: './fullscreen-map-page.html',
  styles: `
  div{
    width: 100vw;
    height:calc( 100vh - 64px);
    background-color:red;
  }

  #controls{
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 9999;
    box-shadow: 0 0 10px 0 rgba(0,0,0,0.1);
    border: 1px solid #e2e8f0;
    width: 250px;

  }
  `
})

export class FullscreenMapPage {

  // Signal query (Angular 17+)
  mapDiv = viewChild<ElementRef<HTMLDivElement>>('map');

  mapSignal = signal<maplibregl.Map | null>(null);
  zoom = signal(2);
  coordinates = signal({
    lng: -3.7635,
    lat: 40.6566

  })
  zoomEffect = effect(() => {
    if (!this.mapSignal()) return;

    this.mapSignal()?.setZoom(this.zoom());
  })

  async ngAfterViewInit() {
    const el = this.mapDiv()?.nativeElement;
    if (!el) return;

    const map = new maplibregl.Map({
      container: el,
      style: 'https://api.maptiler.com/maps/base-v4/style.json?key=KvxcfYAoc3Dudtb1gLQ3', // alternativa estable al globe.json', // alternativa estable al globe.json
      center: this.coordinates(), // Madrid [lng, lat]
      zoom: this.zoom(),


    });

    this.mapListeners(map);

  }

  mapListeners(map: maplibregl.Map) {

    map.on('zoomend', (event) => {
      const newZoom = event.target.getZoom();
      this.zoom.set(newZoom);
    });
    map.on('moveend', () => {
      const center = map.getCenter();
      console.log(center);
      this.coordinates.set(center);
    });

    map.on('load', () => {
      console.log('Map loaded');
    })

    map.addControl(new maplibregl.FullscreenControl());
    map.addControl(new maplibregl.NavigationControl());
    map.addControl(new maplibregl.ScaleControl());

    this.mapSignal.set(map);

  }

}
