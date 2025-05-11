import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../components/sidebar/sidebar.component";
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import API_URL from '../../../core/config/config';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear-camion',
  standalone: true,
  imports: [SidebarComponent, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './crear-camion.component.html',
  styleUrl: './crear-camion.component.css'
})
export class CrearCamionComponent implements OnInit {
  tituloFormulario: string = '';
  textoBoton: string = '';
  esModoEditar: boolean = false;
  id: string | null = '';
  error: string = '';

  licensePlate: string = '';
  type: string = '';
  state: string = 'available';
  entryTime: string = '';
  departureTime: string = '';

  usuarios: any[] = [];
  conductorSeleccionado: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const modo = this.route.snapshot.data['modo'];
    this.esModoEditar = modo === 'editar';
    this.obtenerUsuarios();

    if (this.esModoEditar) {
      this.id = this.route.snapshot.paramMap.get('id');
      this.tituloFormulario = 'Editar Camión';
      this.textoBoton = 'Guardar Cambios';
      this.cargarDatosDelCamion();
    } else {
      this.tituloFormulario = 'Crear Camión';
      this.textoBoton = 'Crear Camión';
    }
  }

  async obtenerUsuarios(): Promise<void> {
      try {
        let response: any = await this.http.get(`${API_URL}/users/`).toPromise();
        response = response.filter((user: any) => user.userType === 'camion');
        this.usuarios = response;
      } catch (err: any) {
        this.error = err?.error?.message || 'Error al cargar usuarios. Inténtelo de nuevo.';
        console.error(this.error);
      }
    }

  async crearCamion(): Promise<void> {
    if (!this.licensePlate || !this.type || !this.entryTime || !this.departureTime || !this.conductorSeleccionado) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    const nuevoCamion = {
      licensePlate: this.licensePlate,
      userId: this.conductorSeleccionado,
      type: this.type,
      state: this.state,
      entryTime: this.entryTime,
      departureTime: this.departureTime
    };

    try {
      const response = await this.http.post(`${API_URL}/trucks/`, nuevoCamion).toPromise();
      console.log('Camión creado exitosamente:', response);
      this.redirectCamiones();
    } catch (err: any) {
      this.error = err?.error?.message || 'Error al crear el camión. Inténtelo de nuevo.';
      console.error(this.error);
    }
  }

  async editarCamion(): Promise<void> {
    if (!this.licensePlate || !this.type || !this.entryTime || !this.departureTime || !this.conductorSeleccionado) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    const camionEditado = {
      licensePlate: this.licensePlate,
      userId: this.conductorSeleccionado,
      type: this.type,
      state: this.state,
      entryTime: this.entryTime,
      departureTime: this.departureTime
    };

    try {
      const response = await this.http.put(`${API_URL}/trucks/${this.id}`, camionEditado).toPromise();
      console.log('Camión editado exitosamente:', response);
      this.redirectCamiones();
    } catch (err: any) {
      this.error = err?.error?.message || 'Error al editar el camión. Inténtelo de nuevo.';
      console.error(this.error);
    }
  }

  async cargarDatosDelCamion(): Promise<void> {
    try {
      const camion = await this.http.get<any>(`${API_URL}/trucks/${this.id}`).toPromise();
      this.licensePlate = camion.licensePlate;
      this.conductorSeleccionado = camion.userId;
      this.type = camion.type;
      this.state = camion.state;
      this.entryTime = camion.entryTime;
      this.departureTime = camion.departureTime;
    } catch (err: any) {
      this.error = err?.error?.message || 'Error al cargar el camión. Inténtelo de nuevo.';
      console.error(this.error);
    }
  }

  manejarAccion(): void {
    if (this.esModoEditar) {
      this.editarCamion();
    } else {
      this.crearCamion();
    }
  }

  redirectCamiones(){
    this.router.navigate(['/camiones']);
  }
}
