import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../components/sidebar/sidebar.component";
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import API_URL from '../../../core/config/config';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  imports: [SidebarComponent, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  usuarios: any[] = []; // Lista de usuarios obtenida desde el backend
  error: string | null = null;
  usuarioAEliminar: string | null = null;
  showConfirmation: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  async ngOnInit(): Promise<void> {
    try {
      const response: any = await this.http.get(`${API_URL}/users/`).toPromise();
      this.usuarios = response;
    } catch (err: any) {
      this.error = err?.error?.message || 'Error al cargar los usuarios.';
      console.error('Error al obtener los usuarios:', this.error);
    }
  }

  redirectCrearUsuario() {
    this.router.navigate(['/crear-usuario']);
  }

  editarUsuario(id: number) {
    this.router.navigate(['/editar-usuario', id]);
  }

  // Función para eliminar el usuario (muestra la confirmación)
  eliminarUsuario(id: number) {
    this.usuarioAEliminar = String(id);
    this.showConfirmation = true;
  }

  // Función para confirmar la eliminación
  async confirmarEliminacion(): Promise<void> {
    try {
      if (this.usuarioAEliminar) {
        await this.http.delete(`${API_URL}/users/${this.usuarioAEliminar}`).toPromise();
        this.usuarios = this.usuarios.filter(usuario => usuario.id !== Number(this.usuarioAEliminar));
        this.showConfirmation = false;
      }
    } catch (err: any) {
      this.error = err?.error?.message || 'Error al eliminar el usuario.';
      console.error('Error al eliminar el usuario:', this.error);
    }
  }

  // Función para cancelar la eliminación
  cancelarEliminacion(): void {
    this.showConfirmation = false;
    this.usuarioAEliminar = null;
  }
}
