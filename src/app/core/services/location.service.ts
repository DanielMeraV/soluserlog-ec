import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import API_URL from '../../core/config/config';

import { WebSocketService } from '../../core/services/web-socket.service';
import { interval, Subscription } from 'rxjs';
import { GpsService } from '../../core/services/gps.service';

@Injectable({
  providedIn: 'root'
})
export class LocationService{

  private locationUpdateSubscription?: Subscription;
  private periodicUpdateSubscription?: Subscription;
  private guardarUbicacionSubscription?: Subscription;
  private truckId: string | null = "";

  latitud: number | null = null;
  longitud: number | null = null;

  constructor(private webSocketService: WebSocketService, private gpsService: GpsService, private http: HttpClient) {}

  public init(): void {
  this.truckId = localStorage.getItem('currentTruckId');

  if (this.truckId === '-1' || this.truckId === '-2') {
    return;
  } else {
    this.setupPeriodicUpdates();
    this.guardarUbicacionPeriodicamente(900000); // 15 minutos

    const currentTruckId = this.webSocketService.getCurrentTruckId();
    if (currentTruckId) {
      this.loadLastLocation(currentTruckId);
    }
  }
}


  public destroy(): void {
  this.locationUpdateSubscription?.unsubscribe();
  this.periodicUpdateSubscription?.unsubscribe();
  this.guardarUbicacionSubscription?.unsubscribe();

  console.log('Suscripciones canceladas.');
}

  // Guardar nueva ubicación
  saveLocation(locationData: {
    id_truck: number;
    latitude: number;
    longitude: number;
  }): Observable<any> {
    return this.http.post(`${API_URL}/location/`, locationData);
  }

  // Obtener última ubicación de un camión del historial
  getLastLocation(id_truck: number): Observable<any> {    
    return this.http.get<any>(`${API_URL}/location/${id_truck}`);
  }

  getUpdateLocation(id_truck: number): Observable<any> {    
    return this.http.get<any>(`${API_URL}/location/latest/${id_truck}`);
  }

  // Guardado por websocket
  private setupPeriodicUpdates(): void {
    // Actualizar cada 1 segundos = 1000
    this.periodicUpdateSubscription = interval(1000).subscribe(() => {
      const currentTruckId = this.webSocketService.getCurrentTruckId();
      if (currentTruckId) {
        this.loadLastLocation(currentTruckId);
      }
    });
  }

  private loadLastLocation(id_truck: string): void {    
    const id = localStorage.getItem('currentTruckId');
    this.getUpdateLocation(parseFloat(id_truck)).subscribe({
      next: (data) => { 
      if(id!='-1' && id!='-2')
        this.saveLatestLocation(this.webSocketService.getCurrentTruckId(), data.latitude, data.longitude, data.time);
      }, 
      error: (error) => console.error('Error al cargar ubicación:', error)
    });
  }

  private async saveLatestLocation(id_truck: string | null, latitude: number, longitude: number, time: string): Promise<void> {
      console.log(id_truck); 
  
      this.webSocketService.updateLocation({
        latitude: latitude,
        longitude: longitude
      });
    }

    async obtenerYEnviarUbicacion(): Promise<void> {
            this.gpsService.obtenerUbicacion()
              .then(async coords => {
                this.latitud = coords.latitud;
                this.longitud = coords.longitud;
                console.log(`Ubicación obtenida: ${this.latitud}, ${this.longitud}.  TruckID: ${this.truckId}`);
        
                const ubicacion = { id_truck: this.truckId, latitude: this.latitud, longitude: this.longitud }
                let response = await this.http.post(`${API_URL}/location/`, ubicacion).toPromise();
                response = await this.http.post(`${API_URL}/location/latest/`, ubicacion).toPromise();
                console.log('Ubicación enviada al backend:', response);
              })
              .catch(error => {
                console.error(error);
              });
          }

      private guardarUbicacionPeriodicamente(intervalo: number): void {
      const id = parseInt(this.truckId ?? "-1");
      if (id > 0) {
        this.guardarUbicacionSubscription = interval(intervalo).subscribe(() => {
          this.obtenerYEnviarUbicacion();
        });
      }
  }




}