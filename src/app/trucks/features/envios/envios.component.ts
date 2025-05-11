import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../components/sidebar/sidebar.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import API_URL from '../../../core/config/config';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-envios',
  imports: [SidebarComponent, HttpClientModule, CommonModule],
  templateUrl: './envios.component.html',
  styleUrl: './envios.component.css'
})
export class EnviosComponent implements OnInit {

  manifiestos: any[] = [];
  error: string | null = null;
  truckId: string | null = "";

  constructor(private router: Router, private http: HttpClient) { }


  async ngOnInit(): Promise<void> {
    try {
      this.truckId = localStorage.getItem('currentTruckId');
      
      const response: any = await this.http.get(`${API_URL}/manifestos/`).toPromise();
      if(this.truckId != '-1'){ // Si no es admin
        this.manifiestos = response.filter((m: any) => m.truckId.toString() === this.truckId);
      }else{
        this.manifiestos = response;
      }


    } catch (err: any) {
      this.error = err?.error?.message || 'Error al cargar los pedidos.';
      console.error('Error al obtener los pedidos:', this.error);
    }
  }

  async comprobarBitacoras(idManifiesto: number) {
    try {
      let response: any = await this.http.get(`${API_URL}/logbook/`).toPromise();  
      const bitacoras = response;     
      
      let ultimaBitacora = null;
      let finalizado = false;

      if(Array.isArray(bitacoras) && response.length > 0){        
        for (const bitacora of bitacoras) {

          response = await this.http.get(`${API_URL}/orders/`).toPromise();  
          response = response.filter((order: any) => order.manifestoId === bitacora.manifestoId);

          finalizado = response.every((order: any) => order.state === 'delivered');;
  
          if (bitacora.manifestoId === idManifiesto) {
            ultimaBitacora = bitacora; 
            break; 
          }
        }
      }
      
      if(ultimaBitacora === null || ultimaBitacora.manifestoId != idManifiesto){
        this.redirectCrearBitacora(idManifiesto);
      }else if(!finalizado){
        this.redirectDetallesBitacora(ultimaBitacora.id);
      }else{
        this.redirectBitacora(ultimaBitacora.id);
      }

    } catch (err: any) {
      this.error = err?.error?.message || 'Error al cargar las bitacoras.';
      console.error('Error al obtener las bitacoras:', this.error);
    }
  }

  redirectCrearBitacora(idManifiesto: number) {
    this.router.navigate([`/crear-bitacora/${idManifiesto}`]);
  }

  redirectDetallesBitacora(idBitacora: number) {
    this.router.navigate([`/detalles-bitacora/${idBitacora}`]);
  }

  redirectBitacora(idBitacora: number) {
    this.router.navigate([`/`]);
  }

}
