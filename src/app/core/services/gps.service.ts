import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GpsService {
  
  constructor() {}

  obtenerUbicacion(): Promise<{ latitud: number, longitud: number }> {
    return new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitud: position.coords.latitude,
              longitud: position.coords.longitude
            });
          },
          (error) => {
            reject(`Error obteniendo ubicación: ${error.message}`);
          }
        );
      } else {
        reject('La geolocalización no es compatible en este navegador.');
      }
    });
  }
}
