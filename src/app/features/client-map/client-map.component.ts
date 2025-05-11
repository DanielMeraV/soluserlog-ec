import { Component, OnInit  } from '@angular/core';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { StaticMapsComponent } from "../../components/static-maps/static-maps.component";
import { MapLocationutils } from "../../core/utils/map-location.utils";
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import API_URL from '../../core/config/config';

@Component({
  selector: 'app-client-map',
  imports: [SidebarComponent, StaticMapsComponent, HttpClientModule],
  templateUrl: './client-map.component.html',
  styleUrl: './client-map.component.css'
})
export class ClientMapComponent implements OnInit {
   
  coordinates: any[] = [];
  lat: number = 0; 
  lon: number = 0;
  name: string = "";
  cliente: any = null;

  constructor(
      private route: ActivatedRoute, 
      private router: Router, 
      private http: HttpClient
    ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('idCliente');
    if(id) {
      this.getCustomerLocation(id);

    }else {
      alert("No se ha encontrado el cliente solicitado.");
    }
  }

  async getCustomerLocation(id: string): Promise<void> {
    try {
      this.cliente = await this.http.get(`${API_URL}/customers/${id}`).toPromise()
      console.log(this.cliente);
      
      const data = await MapLocationutils.getCustomerLocation(id); 
      
      this.coordinates = data.location.split(';');
      this.lat = parseFloat(this.coordinates[0].trim());
      this.lon = parseFloat(this.coordinates[1].trim());
      this.name = data.companyName;
    } catch (error) {
      console.error('Error al obtener la ubicación:', error);
    }
  }

  volver(){
    const previousUrl = localStorage.getItem('previousUrl');
    if (previousUrl) {
      this.router.navigate([previousUrl]);
    }
  }

}
