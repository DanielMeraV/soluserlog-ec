import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import axios from 'axios'; 

@Component({
  selector: 'app-static-maps',
  standalone: true, // Añade esta línea
  templateUrl: './static-maps.component.html',
  styleUrls: ['./static-maps.component.css']
})
export class StaticMapsComponent implements OnInit, OnChanges {
  @Input() lat: number = 0; 
  @Input() lon: number = 0;
  @Input() name: string = ''; 

  private map: L.Map | null = null;
  private marker: L.Marker | null = null;

  ngOnInit(): void {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['lat'] || changes['lon']) && !changes['lat']?.firstChange) {
      this.updateMapView();
    }
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [this.lat, this.lon], 
      zoom: 13,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    this.updateMapView();
  }

  private updateMapView(): void {
    if (!this.map) return;

    // Actualizar centro del mapa
    this.map.setView([this.lat, this.lon], 13);

    // Eliminar marcador existente si hay uno
    if (this.marker) {
      this.map.removeLayer(this.marker);
    }

    // Crear nuevo marcador
    const iconoSinSombra = L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34]
          // No incluyas shadowUrl
        });

    this.marker = L.marker([this.lat, this.lon], { icon: iconoSinSombra }).addTo(this.map);
    this.marker.bindPopup(`<b>${this.name}</b>`).openPopup();

    // Actualizar dirección
    this.getAddress(this.lat, this.lon).then(address => {
      if (this.marker) {
        this.marker.bindPopup(`<b>Dirección:</b> ${address}`).openPopup();
      }
    });
  }

  async getAddress(lat: number, lon: number): Promise<string> {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
    try {
      const response = await axios.get(url);
      const address = response.data.display_name;
      return address;
    } catch (error) {
      console.error('Error al obtener la dirección:', error);
      return 'Dirección no disponible';
    }
  }
}