import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../components/sidebar/sidebar.component";
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import API_URL from '../../../core/config/config';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [SidebarComponent, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './crear-usuario.component.html',
  styleUrl: './crear-usuario.component.css'
})
export class CrearUsuarioComponent implements OnInit {
  tituloFormulario: string = '';
  textoBoton: string = '';
  esModoEditar: boolean = false;
  id: string | null = '';
  error: string = '';

  username: string = '';
  password: string = ''; // Campo obligatorio en la creación
  name: string = '';
  userType: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const modo = this.route.snapshot.data['modo'];
    this.esModoEditar = modo === 'editar';

    if (this.esModoEditar) {
      this.id = this.route.snapshot.paramMap.get('id');
      this.tituloFormulario = 'Editar Usuario';
      this.textoBoton = 'Guardar Cambios';
      this.cargarDatosDelUsuario();
    } else {
      this.tituloFormulario = 'Crear Usuario';
      this.textoBoton = 'Crear Usuario';
    }
  }

  async crearUsuario(): Promise<void> {
    if (!this.username || !this.password || !this.name || !this.userType) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    const nuevoUsuario = {
      username: this.username,
      password: this.password, // La API espera un hash, pero se enviará la contraseña en texto plano
      name: this.name,
      userType: this.userType
    };

    try {
      const response = await this.http.post(`${API_URL}/auth/signup/`, nuevoUsuario).toPromise();
      console.log('Usuario creado exitosamente:', response);
      this.redirectUsuarios();
    } catch (err: any) {
      this.error = err?.error?.message || 'Error al crear el usuario. Inténtelo de nuevo.';
      console.error(this.error);
    }
  }

  async editarUsuario(): Promise<void> {
    if (!this.username || !this.name || !this.userType) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    const usuarioEditado = {
      username: this.username,
      name: this.name,
      userType: this.userType
    };

    try {
      const response = await this.http.put(`${API_URL}/users/${this.id}`, usuarioEditado).toPromise();
      console.log('Usuario editado exitosamente:', response);
      this.redirectUsuarios();
    } catch (err: any) {
      this.error = err?.error?.message || 'Error al editar el usuario. Inténtelo de nuevo.';
      console.error(this.error);
    }
  }

  async cargarDatosDelUsuario(): Promise<void> {
    try {
      const usuario = await this.http.get<any>(`${API_URL}/users/${this.id}`).toPromise();
      this.username = usuario.username;
      this.name = usuario.name;
      this.userType = usuario.userType;
    } catch (err: any) {
      this.error = err?.error?.message || 'Error al cargar el usuario. Inténtelo de nuevo.';
      console.error(this.error);
    }
  }

  manejarAccion(): void {
    if (this.esModoEditar) {
      this.editarUsuario();
    } else {
      this.crearUsuario();
    }
  }

  redirectUsuarios(){
    this.router.navigate(['/usuarios']);
  }
}
