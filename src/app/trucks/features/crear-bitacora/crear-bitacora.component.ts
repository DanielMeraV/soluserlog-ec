import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../components/sidebar/sidebar.component";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import API_URL from '../../../core/config/config';

@Component({
  selector: 'app-crear-bitacora',
  imports: [SidebarComponent, CommonModule, FormsModule],
  templateUrl: './crear-bitacora.component.html',
  styleUrl: './crear-bitacora.component.css'
})
export class CrearBitacoraComponent implements OnInit{

  fecha: string = '';
  horaCarga: string = '';
  horaSalida: string = '';
  temperaturaCarga: string = '';
  humedadCarga: string = '';
  error: string = '';
  today: string = '';
  idManifiesto: string | null = '';
  datalogger: string = '';


  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {}

  ngOnInit() {
    const currentDate = new Date();
    this.today = currentDate.toISOString().split('T')[0]; // Formato 'YYYY-MM-DD'
    this.fecha = this.today; // Bloquea la fecha como la de hoy
  }

  async crearBitacora(){
    if (!this.fecha || !this.horaCarga || !this.horaSalida || !this.temperaturaCarga || !this.humedadCarga) {
          alert('Por favor, complete todos los campos obligatorios.');
          return;
        }
      
        this.idManifiesto = this.route.snapshot.paramMap.get('idManifiesto');
        const nuevaBitacora = {
          manifestoId: this.idManifiesto,
          date: this.fecha,
          datalogger: this.datalogger,
          loadTime: this.horaCarga,
          departureTime: this.horaSalida,
          loadTemperature: this.temperaturaCarga,
          loadHumidity: this.humedadCarga
        };    
        
        try {
          let response: any = await this.http.post(`${API_URL}/logbook/`, nuevaBitacora).toPromise();
          console.log('Bitacora creado exitosamente:', response);
          
          this.redirectDetallesBitacora(response.id);
        } catch (err: any) {
          this.error = err?.error?.message || 'Error al crear el pedido. Inténtelo de nuevo.';
          console.error(this.error);
        }
  }

  redirectEnvios() {
    this.router.navigate(['/envios']);
  }
  redirectDetallesBitacora(idBitacora: number) {
    this.router.navigate([`/detalles-bitacora/${idBitacora}`]);
  }

}
