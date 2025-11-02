import { JsonPipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, signal, viewChild } from '@angular/core';
import maplibregl, { LngLatLike, MapMouseEvent } from 'maplibre-gl';
import { v4 as UUIDv4 } from 'uuid';

interface Marker {
  id: string,
  mapMarker: maplibregl.Marker
  color: string
}

@Component({
  selector: 'app-markers-page',
  imports: [JsonPipe],
  templateUrl: './markers-page.html',
})


export class MarkersPage implements AfterViewInit {

  mapDiv = viewChild<ElementRef<HTMLDivElement>>('map');
  mapSignal = signal<maplibregl.Map | null>(null);

  markers = signal<Marker[]>([]);

  async ngAfterViewInit() {
    const el = this.mapDiv()?.nativeElement;
    if (!el) return;

    const map = new maplibregl.Map({
      container: el,
      style: 'https://api.maptiler.com/maps/base-v4/style.json?key=KvxcfYAoc3Dudtb1gLQ3', // alternativa estable al globe.json', // alternativa estable al globe.json
      center: [-3.7635, 40.65659],
      zoom: 14,

    });


    this.mapListeners(map);

  }
  mapListeners(map: maplibregl.Map) {

    map.on('click', (event) => {
      this.mapClick(event);
    });

    this.mapSignal.set(map);

  }

  mapClick(event: maplibregl.MapMouseEvent) {


    if (!this.mapSignal) return;



    const color = '#xxxxxx'.replace(/x/g, (y) =>
      ((Math.random() * 16) | 0).toString(16)
    );
    const marker = new maplibregl.Marker({

      draggable: false,
      color: color
    }).setLngLat(event.lngLat).addTo(this.mapSignal()!);

    const newMarker: Marker = {
      id: UUIDv4(),
      mapMarker: marker,
      color: color
    }
    this.markers.set([newMarker, ...this.markers()])
    console.log(this.markers());
  }

  flyToMarker(lngLat: LngLatLike) {

    if (!this.mapSignal()) return;

    this.mapSignal()?.flyTo({
      center: lngLat
    })

  }

  deleteMarker(marker: Marker) {
    if (!this.mapSignal()) return;

    const map = this.mapSignal();

    marker.mapMarker.remove();
    this.markers.set(this.markers().filter((m) => m.id !== marker.id));
  }

}


