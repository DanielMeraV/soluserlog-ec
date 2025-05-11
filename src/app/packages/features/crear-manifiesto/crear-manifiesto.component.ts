import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../components/sidebar/sidebar.component";
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import API_URL from '../../../core/config/config';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-crear-manifiesto',
  imports: [SidebarComponent, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './crear-manifiesto.component.html',
  styleUrl: './crear-manifiesto.component.css'
})
export class CrearManifiestoComponent implements OnInit {

  pedidos: any[] = [];
  error: string | null = null;
  pedidosSeleccionados: any[] = [];
  placaSeleccionado: string = '';
  placas: any[] = [];

  constructor(private router: Router, private http: HttpClient) { } 

  async ngOnInit(): Promise<void> {
    try {
      const response: any = await this.http.get(`${API_URL}/orders/`).toPromise();
      this.pedidos = response.filter((pedido: any) => pedido.state === 'toBeDispatched');
      //this.pedidos = this.pedidos.sort((a: any, b: any) => new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime());
      this.obtenerPlacas();
      
    } catch (err: any) {
      this.error = err?.error?.message || 'Error al cargar los pedidos.';
      console.error('Error al obtener los pedidos:', this.error);
    }
  }

  async obtenerPlacas(): Promise<void> {
    try {
      const response: any = await this.http.get(`${API_URL}/trucks/`).toPromise();
      this.placas = response.filter((placas: any) => placas.state === 'available');
    } catch (err: any) {
      this.error = err?.error?.message || 'Error al cargar usuarios. Inténtelo de nuevo.';
      console.error(this.error);
    }
  }

  redirectPedidosPorDespachar(){
    this.router.navigate(['/pedidos-por-despachar']);
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

  async crearManifiesto(): Promise<void> {
    
    if (this.pedidosSeleccionados.length === 0 || !this.placaSeleccionado) {
      alert('Por favor, seleccione el camión y los pedidos para crear el manifiesto.');
      return;
    }
  
    const nuevoManifiesto = {
      truckId: this.placaSeleccionado,
      assignmentDate: new Date().toISOString(),
      manifestoPdf: null,
      referralGuidePdf: null
    };    
    
    try {
      await this.http.post(`${API_URL}/manifestos/`, nuevoManifiesto).toPromise();
      const response: any = await this.http.get(`${API_URL}/manifestos/`).toPromise();
      
      let manifestoId = response
      .filter((manifesto: any) => manifesto.truckId === parseInt(this.placaSeleccionado, 10))
      .sort((a: any, b: any) => new Date(b.assignmentDate).getTime() - new Date(a.assignmentDate).getTime());
      
      manifestoId = manifestoId.length > 0 ? manifestoId[0].id : null;

      for (const pedido of this.pedidosSeleccionados) {        
        await this.http.put(`${API_URL}/orders/${pedido.id}`, { manifestoId: manifestoId, state: 'inManifesto' }).toPromise();
      }

      console.log('Pedido creado exitosamente');
      this.redirectPedidosPorDespachar();
    } catch (err: any) {
      this.error = err?.error?.message || 'Error al crear el pedido. Inténtelo de nuevo.';
      console.error(this.error);
    }
  }
}
