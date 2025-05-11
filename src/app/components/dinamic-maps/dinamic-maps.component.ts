import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { WebSocketService } from '../../core/services/web-socket.service';
import { LocationService } from '../../core/services/location.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { GpsService } from '../../core/services/gps.service';
import { ActivatedRoute, Router } from '@angular/router';
import API_URL from '../../core/config/config';
import axios from 'axios';

@Component({
  selector: 'app-dinamic-maps',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './dinamic-maps.component.html',
  styleUrl: './dinamic-maps.component.css'
})
export class DinamicMapsComponent implements OnInit {

  private map!: L.Map;
  private truckMarkers: { [id: string]: L.Marker } = {};
  private truckId: string | null = "";
  private locationUpdateSubscription?: Subscription;
  error: string | null = null;

  address: string = "";
  latitud: number | null = null;
  longitud: number | null = null;

  constructor(
    private webSocketService: WebSocketService, 
    private locationService: LocationService, 
    private gpsService: GpsService, 
    private http: HttpClient,
    private route: ActivatedRoute, 
  ) {}

  ngOnInit(): void {
    this.initMap();
    this.setupWebSocketUpdates();

    this.truckId = localStorage.getItem('currentTruckId');

    if(this.truckId === '-1' || this.truckId === '-2'){
      this.truckId = this.route.snapshot.paramMap.get('idCamion');
      if(this.truckId)this.webSocketService.setTruckId(this.truckId);
    }
    
    // Cargar última ubicación conocida al iniciar
    const currentTruckId = this.webSocketService.getCurrentTruckId();
    
    if (currentTruckId) {
      this.loadLastLocation(currentTruckId);
    }
  }
  
  ngOnDestroy(): void {
    this.locationUpdateSubscription?.unsubscribe();
  }

  private setupWebSocketUpdates(): void {
    this.locationUpdateSubscription = this.webSocketService
      .on('locationUpdate')
      .subscribe(this.updateMarker.bind(this));
  }

  private loadLastLocation(id_truck: string): void {    
    const id = localStorage.getItem('currentTruckId');
    this.locationService.getUpdateLocation(parseFloat(id_truck)).subscribe({
      next: (data) => {this.updateMarker(data)}, 
      error: (error) => console.error('Error al cargar ubicación:', error)
    });
  }

  private updateMarker(data: any): void {
    const { id_truck, latitude, longitude, time } = data;

    const iconoSinSombra = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
      // No incluyas shadowUrl
    });
    
    if (!this.truckMarkers[id_truck]) {
      this.truckMarkers[id_truck] = L.marker([latitude, longitude], { icon: iconoSinSombra })
        .bindPopup(this.createPopupContent(id_truck, time))
        .addTo(this.map);
    } else {
      this.truckMarkers[id_truck]
        .setLatLng([latitude, longitude])
        .setPopupContent(this.createPopupContent(id_truck, time));
    }

    // Centrar mapa si es el camión seleccionado
    this.map.setView([latitude, longitude], 15);
  }

  private createPopupContent(id_truck: string, time: string): string {
    return `
      <div>
        <strong>Camión ID:</strong> ${id_truck}<br>
        <strong>Última actualización:</strong> ${new Date(time).toLocaleString()}
      </div>
    `;
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [-0.22, -78.5125],
      zoom: 12,
      dragging: false,         // Desactiva arrastrar con el mouse
      scrollWheelZoom: false,  // Desactiva zoom con la rueda del mouse
      doubleClickZoom: false,  // Desactiva zoom con doble clic
      boxZoom: false,          // Desactiva zoom con selección de área
      keyboard: false,         // Desactiva controles con el teclado
      zoomControl: false       // Oculta los controles de zoom en la UI
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(this.map);
  }

  async obtenerYEnviarUbicacion(): Promise<void> {
    const truckId = localStorage.getItem('currentTruckId');
  
    if (!truckId) {
      console.warn('No hay currentTruckId en localStorage.');
      return;
    }
  
    if (truckId === '-1' || truckId === '-2') {
      // Si es admin o paquetería, consultar dirección pero no guardar ubicación
      try {
        const response: any = await this.http.get(`${API_URL}/location/${this.truckId}`).toPromise(); // ← usa el ID del camión que quieras consultar
        const { latitude, longitude } = response;
        this.address = await this.getAddress(latitude, longitude);
      } catch (error) {
        console.error('Error al obtener ubicación desde backend:', error);
      }
      return;
    }
  
    // Usuarios tipo camión: obtienen y envían ubicación real
    this.truckId = truckId;
    this.gpsService.obtenerUbicacion()
      .then(async coords => {
        this.latitud = coords.latitud;
        this.longitud = coords.longitud;
        console.log(`Ubicación obtenida: ${this.latitud}, ${this.longitud}`);
  
        const ubicacion = { id_truck: this.truckId, latitude: this.latitud, longitude: this.longitud };
        const response = await this.http.post(`${API_URL}/location/`, ubicacion).toPromise();
        console.log('Ubicación enviada al backend:', response);
  
        this.address = await this.getAddress(this.latitud, this.longitud);
      })
      .catch(error => {
        console.error('Error al obtener ubicación del GPS:', error);
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