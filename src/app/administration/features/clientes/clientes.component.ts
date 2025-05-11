import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../components/sidebar/sidebar.component";
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import API_URL from '../../../core/config/config';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-clientes',
  imports: [SidebarComponent, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  clientes: any[] = []; // Lista de clientes obtenida desde el backend
  error: string | null = null;
  clienteAEliminar: string | null = null;
  showConfirmation: boolean = false;

  constructor(private router: Router, private http: HttpClient) {}

  async ngOnInit(): Promise<void> {
    try {
      const response: any = await this.http.get(`${API_URL}/customers/`).toPromise();
      this.clientes = response;
    } catch (err: any) {
      this.error = err?.error?.message || 'Error al cargar los clientes.';
      console.error('Error al obtener los clientes:', this.error);
    }
  }

  redirectCrearCliente() {
    this.router.navigate(['/crear-cliente']);
  }

  editarCliente(id: number) {
    this.router.navigate(['/editar-cliente', id]);
  }

  eliminarCliente(id: number) {
    this.clienteAEliminar = String(id);
    this.showConfirmation = true;
  }

  async confirmarEliminacion(): Promise<void> {
    try {
      if (this.clienteAEliminar) {
        await this.http.delete(`${API_URL}/customers/${this.clienteAEliminar}`).toPromise();
        this.clientes = this.clientes.filter(cliente => cliente.id !== Number(this.clienteAEliminar));
        this.showConfirmation = false;
      }
    } catch (err: any) {
      this.error = err?.error?.message || 'Error al eliminar el cliente.';
      console.error('Error al eliminar el cliente:', this.error);
    }
  }

  cancelarEliminacion(): void {
    this.showConfirmation = false;
    this.clienteAEliminar = null;
  }

  verUbicacionDestino(clienteId: string){
    localStorage.setItem('previousUrl', this.router.url);
    const Cliente = this.clientes.find((c: any) => c.id === clienteId);
    this.router.navigate([`/client-map/${Cliente.id}`]);
  }
}
