import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../components/sidebar/sidebar.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import API_URL from '../../../core/config/config';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bitacoras',
  imports: [SidebarComponent, HttpClientModule, CommonModule],
  templateUrl: './bitacoras.component.html',
  styleUrl: './bitacoras.component.css'
})
export class BitacorasComponent implements OnInit {

  camionesFijos: any[] = [];
  camionesAdicionales: any[] = [];
  error: string | null = null;
  bitacorasPorCamion: { [key: number]: any[] } = {};
  truckId: string | null = "";

  constructor(private http: HttpClient) { } 

  async ngOnInit(): Promise<void> {
    this.truckId = localStorage.getItem('currentTruckId');
    try {
      const response: any = await this.http.get(`${API_URL}/trucks/`).toPromise();    
      
      this.camionesFijos = response.filter((camion: any) => camion.type === 'permanent');
      this.camionesAdicionales = response.filter((camion: any) => camion.type === 'additional');

      if (this.truckId != '-1') { // Si no es admin
        this.camionesFijos = this.camionesFijos.filter((cf: any) => cf.id.toString() === this.truckId);
        this.camionesAdicionales = this.camionesAdicionales.filter((ca: any) => ca.id.toString() === this.truckId);
      }
      
      this.camionesFijos.forEach(camion => {
        this.getBitacoras(camion.id);
      });

      this.camionesAdicionales.forEach(camion => {
        this.getBitacoras(camion.id);
      });

    } catch (err: any) {
      this.error = err?.error?.message || 'Error al cargar los camiones.';
      console.error('Error al obtener los camiones:', this.error);
    }
  }

  async getBitacoras(camionId: number): Promise<void> {
    try {
      const manifiestosResponse = await this.http.get<any[]>(`${API_URL}/manifestos/truck/${camionId}`).toPromise();
      
      let bitacoraResponse = await this.http.get<any[]>(`${API_URL}/logbook/`).toPromise();
      let bitacoras: any[] = [];
  
      for (const manifiesto of manifiestosResponse!) {
        const bitacora = bitacoraResponse!.find((bitacora: any) => bitacora.manifestoId === manifiesto.id);
  
        if (bitacora) {
          bitacoras.push(bitacora);
        }
      }
  
      if (bitacoras.length > 0) {
        this.bitacorasPorCamion[camionId] = bitacoras;
      } else {
        this.bitacorasPorCamion[camionId] = [{
          id: "---",
          date: null,
          bitacoraPdf: "---"
        }];
        console.log(camionId + "        " + this.bitacorasPorCamion[camionId]);
        
      }
    } catch (error) {
      console.error("Error al obtener las bitácoras:", error);
    }
  }
  
  

}

