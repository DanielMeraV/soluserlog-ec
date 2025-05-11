import { Component } from '@angular/core';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { WebSocketService } from '../../core/services/web-socket.service';
import { GpsService } from '../../core/services/gps.service';
import { LocationService } from '../../core/services/location.service'; 
import API_URL from '../../core/config/config';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  imports: [SidebarComponent, HttpClientModule],
})
export class DashboardComponent {

  latitud: number | null = null;
  longitud: number | null = null;
  private truckId: string = '';
  error: string | null = null;

 constructor(
  private webSocketService: WebSocketService,
  private http: HttpClient,
  private locationService: LocationService
) {}


  async ngOnInit(): Promise<void> {
    await this.getTruckID();
    this.locationService.init();
    if (this.truckId !== '-1' && this.truckId !== '-2') {
      await this.locationService.obtenerYEnviarUbicacion();
    }

  }

    async getTruckID(): Promise<void> {
      try {
        const username = sessionStorage.getItem('username');
        let response: any = await this.http.get(`${API_URL}/users/username/`+username).toPromise();
        const userId = response.id;
        response = await this.http.get(`${API_URL}/trucks/user/`+userId).toPromise();

        try {
          this.truckId = response.id;
        } catch (error) {
          if(sessionStorage.getItem('userType') === 'admin'){
            this.truckId = '-1';
          }else if(sessionStorage.getItem('userType') === 'paqueteria'){
            this.truckId = '-2';
          }
        }
        
        this.webSocketService.setTruckId(this.truckId);


      } catch (err: any) {
        this.error = err?.error?.message || 'Error al cargar el usuario.';
        console.error('Error al obtener el usuario:', this.error);
      }
    }
  
    


}



