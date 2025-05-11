import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../components/sidebar/sidebar.component";
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import API_URL from '../../../core/config/config';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-camiones',
  imports: [SidebarComponent, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './camiones.component.html',
  styleUrls: ['./camiones.component.css']
})
export class CamionesComponent implements OnInit {
  camiones: any[] = []; // Lista de camiones obtenida desde el backend
  error: string | null = null;
  camionAEliminar: string | null = null;
  showConfirmation: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  async ngOnInit(): Promise<void> {
    try {
      const response: any = await this.http.get(`${API_URL}/trucks/`).toPromise();
      this.camiones = response;
    } catch (err: any) {
      this.error = err?.error?.message || 'Error al cargar los camiones.';
      console.error('Error al obtener los camiones:', this.error);
    }
  }

  redirectCrearCamion() {
    this.router.navigate(['/crear-camion']);
  }

  editarCamion(id: number) {
    this.router.navigate(['/editar-camion', id]);
  }

  eliminarCamion(id: number) {
    this.camionAEliminar = String(id);
    this.showConfirmation = true;
  }

  async confirmarEliminacion(): Promise<void> {
    try {
      if (this.camionAEliminar) {
        await this.http.delete(`${API_URL}/trucks/${this.camionAEliminar}`).toPromise();
        this.camiones = this.camiones.filter(camion => camion.id !== Number(this.camionAEliminar));
        this.showConfirmation = false;
      }
    } catch (err: any) {
      this.error = err?.error?.message || 'Error al eliminar el camión.';
      console.error('Error al eliminar el camión:', this.error);
    }
  }

  cancelarEliminacion(): void {
    this.showConfirmation = false;
    this.camionAEliminar = null;
  }

  verUbicacionDestino(camionId: string){
    localStorage.setItem('previousUrl', this.router.url);
    const camion = this.camiones.find((c: any) => c.id === camionId);
    this.router.navigate([`/truck-map/${camion.id}`]);
  }
}
