import { Component } from '@angular/core';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { DinamicMapsComponent } from "../../components/dinamic-maps/dinamic-maps.component";

import { MapLocationutils } from "../../core/utils/map-location.utils";
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import API_URL from '../../core/config/config';

@Component({
  selector: 'app-truck-map',
  imports: [SidebarComponent, DinamicMapsComponent, HttpClientModule],
  templateUrl: './truck-map.component.html',
  styleUrl: './truck-map.component.css'
})
export class TruckMapComponent {

  camion: any = null;
  conductor: any = null;

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private http: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('idCamion');
    if(id) {
      this.camion = await this.http.get(`${API_URL}/trucks/${id}`).toPromise();
      this.conductor = await this.http.get(`${API_URL}/users/${this.camion.userId}`).toPromise();

    }else {
      alert("No se ha encontrado el camion solicitado.");
    }
  }
/*
  async getTruckLocation(id: string): Promise<void> {
      try {
        
        console.log(this.cliente);
        
        const data = await MapLocationutils.getCustomerLocation(id); 
        
        this.coordinates = data.location.split(';');
        this.lat = parseFloat(this.coordinates[0].trim());
        this.lon = parseFloat(this.coordinates[1].trim());
        this.name = data.companyName;
      } catch (error) {
        console.error('Error al obtener la ubicación:', error);
      }
    }*/

  volver(){
    const previousUrl = localStorage.getItem('previousUrl');
    if (previousUrl) {
      this.router.navigate([previousUrl]);
    }
  }
}
