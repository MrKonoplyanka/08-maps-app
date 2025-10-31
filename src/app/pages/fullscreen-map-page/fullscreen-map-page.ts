import { centroidAttributes } from './../../../../node_modules/maplibre-gl/src/data/bucket/fill_extrusion_attributes';

import { DecimalPipe, JsonPipe } from '@angular/common';
import { AfterViewInit, Component, effect, ElementRef, signal, viewChild } from '@angular/core';
import maplibregl from 'maplibre-gl';


@Component({
  selector: 'app-fullscreen-map-page',
  imports: [DecimalPipe, JsonPipe],
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

  }`
})

export class FullscreenMapPage implements AfterViewInit {

   // Signal query (Angular 17+)
  mapDiv = viewChild<ElementRef<HTMLDivElement>>('map');

  mapSignal = signal<maplibregl.Map|null>(null);
  zoom = signal(2);
  coordinates = signal({
    lng: -1.7038,
    lat: 40.4168

  })
  zoomEffect = effect(()=>{
    if(!this.mapSignal()) return;

    this.mapSignal()?.setZoom(this.zoom());
  })

  ngAfterViewInit(): void {
    const el = this.mapDiv()?.nativeElement;
    if (!el) return;

    const map = new maplibregl.Map({
      container: el,
      style: 'https://demotiles.maplibre.org/style.json', // alternativa estable al globe.json
      center: this.coordinates(), // Madrid [lng, lat]
      zoom: this.zoom(),

    });

    this.mapListeners(map);

  }

  mapListeners(map: maplibregl.Map){

    map.on('zoomend',(event)=>{
      const newZoom = event.target.getZoom();
      this.zoom.set(newZoom);
    })
    this.mapSignal!.set(map);
    map.on('moveend', () => {
      const center = map.getCenter();
      this.coordinates.set(center);
    })

    this.mapSignal.set(map);


  }


}


