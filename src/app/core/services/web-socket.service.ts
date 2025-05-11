import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable, BehaviorSubject } from 'rxjs';
import { WebSocket_URL } from '../config/config';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket!: Socket;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private connectionStatus = new BehaviorSubject<boolean>(false);
  private userId: string | null | undefined = null;
  private currentTruckId: string | null = null;

  constructor() {
    if (!localStorage.getItem('currentTruckId')) {
      localStorage.setItem('currentTruckId', ''); 
      console.log('currentTruckId creado');
      
    }
    this.currentTruckId = localStorage.getItem('currentTruckId');
  
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', '');
      console.log('userId creado');
    }
    this.userId = localStorage.getItem('userId');
  
    this.initializeSocket();
  }

  private initializeSocket(): void {
    const options: any = {
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    };

    // Si tenemos un userId, lo incluimos en la conexión
    if (this.userId) {
      options.query = { 
        userId: this.userId,
        truckId: this.currentTruckId 
      };
    }

    this.socket = io(WebSocket_URL, options);

    this.setupSocketListeners();
  }

  private setupSocketListeners(): void {
     // Manejadores de eventos de conexión
    this.socket.on('connect', () => {
      console.log('Socket conectado:', this.socket.id);
      this.connectionStatus.next(true);
      this.reconnectAttempts = 0;

      // Si es una nueva conexión (no teníamos userId)
      if (!this.userId || this.userId === '' || this.userId === null) {
        this.userId = this.socket.id;
        localStorage.setItem('userId', this.userId || '');
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Socket desconectado');
      this.connectionStatus.next(false);
    });

    this.socket.on('reconnect_attempt', (attempt) => {
      console.log(`Intento de reconexión ${attempt}`);
      this.reconnectAttempts = attempt;
    });

    this.socket.on('reconnect_failed', () => {
      console.log('Falló la reconexión después de', this.maxReconnectAttempts, 'intentos');
    });
  }

  // Método para actualizar el ID del camión
  public setTruckId(truckId: string): void {
    this.currentTruckId = truckId;
    if(!localStorage.getItem('currentTruckId'))localStorage.setItem('currentTruckId', truckId);
    
    // Reconectar el socket con el nuevo truckId si ya está conectado
    if (this.socket.connected) {
      this.socket.disconnect();
      this.initializeSocket();
    }
  }

  // Obtener el ID del camión actual
  public getCurrentTruckId(): string | null {
    return this.currentTruckId;
  }

  // Método para enviar actualización de ubicación
  public updateLocation(data: { latitude: number; longitude: number; }): void {
    if (!this.currentTruckId) {
      console.warn('No hay ID de camión configurado');
      return;
    }

    const locationData = {
      id_truck: this.currentTruckId,
      ...data,
      time: new Date().toISOString()
    };

    this.emit('updateLocation', locationData);
  }

  // Obtener el estado de la conexión como Observable
  public getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus.asObservable();
  }

  // Método para escuchar eventos
  public on(eventName: string): Observable<any> {
    return new Observable((observer) => {
      this.socket.on(eventName, (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.off(eventName);
      };
    });
  }

  // Método para emitir eventos
  public emit(eventName: string, data: any): void {
    if (this.socket.connected) {
      this.socket.emit(eventName, { ...data, userId: this.userId });
    } else {
      console.warn('Socket no conectado. El mensaje se enviará cuando se reconecte.');
      this.socket.once('connect', () => {
        this.socket.emit(eventName, { ...data, userId: this.userId });
      });
    }
  }

  // Método para reconectar manualmente si es necesario
  public reconnect(): void {
    if (!this.socket.connected && this.reconnectAttempts < this.maxReconnectAttempts) {
      this.socket.connect();
    }
  }

  // Método para desconectar manualmente
  public disconnect(): void {
    this.socket.disconnect();
  }

  // Obtener el ID del usuario actual
  public getUserId(): string | null | undefined{
    return this.userId;
  }

  
}