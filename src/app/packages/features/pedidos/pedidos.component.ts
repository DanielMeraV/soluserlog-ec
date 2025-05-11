import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../components/sidebar/sidebar.component";
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import API_URL from '../../../core/config/config';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-pedidos',
  imports: [SidebarComponent, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './pedidos.component.html',
  styleUrl: './pedidos.component.css'
})
export class PedidosComponent implements OnInit {

  pedidos: any[] = [];
  error: string | null = null;
  showConfirmation: boolean = false; 
  pedidoAEliminar: string | null = null;
  pedidosSeleccionados: any[] = [];

  constructor(private router: Router, private http: HttpClient) { } 

  redirectCrearPedido(){
    this.router.navigate(['/crear-pedido']);
  }

  editarPedido(id: string){
    this.router.navigate(['/editar-pedido', id]);
  }

  async ngOnInit(): Promise<void> {
    try {
      const response: any = await this.http.get(`${API_URL}/orders/`).toPromise();
      this.pedidos = response.filter((pedido: any) => pedido.state === 'notAssigned');
    } catch (err: any) {
      this.error = err?.error?.message || 'Error al cargar los pedidos.';
      console.error('Error al obtener los pedidos:', this.error);
    }
  }

  // Función para eliminar el pedido
  async eliminarPedido(id: string): Promise<void> {
    this.pedidoAEliminar = id;
    this.showConfirmation = true; 
  }

  // Función para confirmar la eliminación
  async confirmarEliminacion(): Promise<void> {
    try {
      if (this.pedidoAEliminar) {
        await this.http.delete(`${API_URL}/orders/${this.pedidoAEliminar}`).toPromise();
        
        this.pedidos = this.pedidos.filter(pedido => pedido.id !== this.pedidoAEliminar);
        this.showConfirmation = false; 
      }
    } catch (err: any) {
      this.error = err?.error?.message || 'Error al eliminar el pedido.';
      console.error('Error al eliminar el pedido:', this.error);
    }
  }

  // Función para cancelar la eliminación
  cancelarEliminacion(): void {
    this.showConfirmation = false; 
    this.pedidoAEliminar = null; 
  }

  // Función para confirmar pedidos
  async confirmarPedidos(): Promise<void> {
    try {
      // Recorrer los pedidos seleccionados
      for (const pedido of this.pedidosSeleccionados) {
        const response = await this.http.put(`${API_URL}/orders/${pedido.id}`, { state: 'toBeDispatched' }).toPromise();
        console.log(`Pedido ${pedido.id} actualizado a "toBeDispatched"`);
      }
      this.ngOnInit();
    } catch (err: any) {
      this.error = err?.error?.message || 'Error al confirmar los pedidos.';
      console.error('Error al actualizar los pedidos:', this.error);
    }
  }

  togglePedidoSeleccionado(pedido: any): void {
    const index = this.pedidosSeleccionados.findIndex(p => p.id === pedido.id);
    if (index === -1) {
      this.pedidosSeleccionados.push(pedido); // Agregar si no está seleccionado
    } else {
      this.pedidosSeleccionados.splice(index, 1); // Eliminar si ya está seleccionado
    }
  }

  toggleSelectAll(event: any): void {
    if (event.target.checked) {
      this.pedidosSeleccionados = [...this.pedidos]; // Seleccionar todos los pedidos
    } else {
      this.pedidosSeleccionados = []; // Desmarcar todos los pedidos
    }
  }

}
