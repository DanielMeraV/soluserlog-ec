import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../components/sidebar/sidebar.component";
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import API_URL from '../../../core/config/config';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear-cliente',
  standalone: true,
  imports: [SidebarComponent, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './crear-cliente.component.html',
  styleUrl: './crear-cliente.component.css'
})
export class CrearClienteComponent implements OnInit {
  tituloFormulario: string = '';
  textoBoton: string = '';
  esModoEditar: boolean = false;
  id: string | null = '';
  error: string = '';

  companyName: string = '';
  ruc: string = '';
  email: string = '';
  address: string = '';
  location: string = '';
  phone: string = '';
  city: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const modo = this.route.snapshot.data['modo'];
    this.esModoEditar = modo === 'editar';

    if (this.esModoEditar) {
      this.id = this.route.snapshot.paramMap.get('id');
      this.tituloFormulario = 'Editar Cliente';
      this.textoBoton = 'Guardar Cambios';
      this.cargarDatosDelCliente();
    } else {
      this.tituloFormulario = 'Crear Cliente';
      this.textoBoton = 'Crear Cliente';
    }
  }

  async crearCliente(): Promise<void> {
    if (!this.companyName || !this.ruc || !this.email || !this.address || !this.location || !this.phone || !this.city) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    const nuevoCliente = {
      companyName: this.companyName,
      ruc: this.ruc,
      email: this.email,
      address: this.address,
      location: this.location,
      phone: this.phone,
      city: this.city
    };

    try {
      const response = await this.http.post(`${API_URL}/customers/`, nuevoCliente).toPromise();
      console.log('Cliente creado exitosamente:', response);
      this.redirectClientes();
    } catch (err: any) {
      this.error = err?.error?.message || 'Error al crear el cliente. Inténtelo de nuevo.';
      console.error(this.error);
    }
  }

  async editarCliente(): Promise<void> {
    if (!this.companyName || !this.ruc || !this.email || !this.address || !this.location || !this.phone || !this.city) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    const clienteEditado = {
      companyName: this.companyName,
      ruc: this.ruc,
      email: this.email,
      address: this.address,
      location: this.location,
      phone: this.phone,
      city: this.city
    };

    try {
      const response = await this.http.put(`${API_URL}/customers/${this.id}`, clienteEditado).toPromise();
      console.log('Cliente editado exitosamente:', response);
      this.redirectClientes();
    } catch (err: any) {
      this.error = err?.error?.message || 'Error al editar el cliente. Inténtelo de nuevo.';
      console.error(this.error);
    }
  }

  async cargarDatosDelCliente(): Promise<void> {
    try {
      const cliente = await this.http.get<any>(`${API_URL}/customers/${this.id}`).toPromise();
      this.companyName = cliente.companyName;
      this.ruc = cliente.ruc;
      this.email = cliente.email;
      this.address = cliente.address;
      this.location = cliente.location;
      this.phone = cliente.phone;
      this.city = cliente.city;
    } catch (err: any) {
      this.error = err?.error?.message || 'Error al cargar el cliente. Inténtelo de nuevo.';
      console.error(this.error);
    }
  }

  manejarAccion(): void {
    if (this.esModoEditar) {
      this.editarCliente();
    } else {
      this.crearCliente();
    }
  }

  redirectClientes(){
    this.router.navigate(['/clientes']);
  }
}
