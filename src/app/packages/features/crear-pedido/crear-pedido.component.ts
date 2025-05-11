import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../components/sidebar/sidebar.component";
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import API_URL from '../../../core/config/config';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear-pedido',
  standalone: true,
  imports: [SidebarComponent, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './crear-pedido.component.html',
  styleUrl: './crear-pedido.component.css'
})
export class CrearPedidoComponent implements OnInit {
  tituloFormulario: string = '';
  textoBoton: string = '';
  esModoEditar: boolean = false;
  id: string | null= '';
  error: string = '';

  usuarios: any[] = [];
  remitenteSeleccionado: string = '';
  destinatarioSeleccionado: string = '';
  totalBultos: string = '';
  pesoTotal: string = '';
  fechaEntrega: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    // Detectar el modo desde los parámetros de la ruta
    const modo = this.route.snapshot.data['modo'];
    this.esModoEditar = modo === 'editar';
    this.obtenerUsuarios();

    if (this.esModoEditar) {
      this.id = this.route.snapshot.paramMap.get('id');
      this.tituloFormulario = 'Editar Pedido';
      this.textoBoton = 'Guardar Cambios';
      this.cargarDatosDelPedido(); // Lógica para precargar datos
    } else {
      this.tituloFormulario = 'Crear Pedido';
      this.textoBoton = 'Crear Pedido';
    }
  }

  async obtenerUsuarios(): Promise<void> {
    try {
      const response: any = await this.http.get(`${API_URL}/customers/`).toPromise();
      this.usuarios = response;
    } catch (err: any) {
      this.error = err?.error?.message || 'Error al cargar usuarios. Inténtelo de nuevo.';
      console.error(this.error);
    }
  }

  async crearPedido(): Promise<void> {
    if (!this.remitenteSeleccionado || !this.destinatarioSeleccionado || !this.fechaEntrega || !this.totalBultos || !this.pesoTotal) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }else this. onFechaEntregaChange();
  
    const nuevoPedido = {
      manifestoId: null,
      senderId: this.remitenteSeleccionado,
      receiverId: this.destinatarioSeleccionado,
      state: "notAssigned",
      registrationDate: new Date().toISOString(),
      deliveryDate: this.fechaEntrega,
      totalPackages: Number(this.totalBultos),
      totalWeight: parseFloat(this.pesoTotal),
      ticketPdf: null,
      facturaPdf: null
    };    
    
    try {
      const response = await this.http.post(`${API_URL}/orders/`, nuevoPedido).toPromise();
      console.log('Pedido creado exitosamente:', response);
      this.redirectPedidos();
    } catch (err: any) {
      this.error = err?.error?.message || 'Error al crear el pedido. Inténtelo de nuevo.';
      console.error(this.error);
    }
  }
  
  

  async editarPedido(): Promise<void> {
    if (!this.remitenteSeleccionado || !this.destinatarioSeleccionado || !this.fechaEntrega || !this.totalBultos || !this.pesoTotal) {
        alert('Por favor, complete todos los campos obligatorios.');
        return;
    }else this. onFechaEntregaChange();

    const pedidoEditado = {
      manifestoId: null,
      senderId: this.remitenteSeleccionado,
      receiverId: this.destinatarioSeleccionado,
      state: "notAssigned",
      registrationDate: new Date().toISOString(),
      deliveryDate: this.fechaEntrega,
      totalPackages: Number(this.totalBultos),
      totalWeight: parseFloat(this.pesoTotal),
      ticketPdf: null,
      facturaPdf: null
    };

    try {
      const response = await this.http.put(`${API_URL}/orders/${this.id}`, pedidoEditado).toPromise();
      console.log('Pedido editado exitosamente:', response);
      this.redirectPedidos();
    } catch (err: any) {
      this.error = err?.error?.message || 'Error al editar el pedido. Inténtelo de nuevo.';
      console.error(this.error);
    }
  }

  async cargarDatosDelPedido(): Promise<void> {
    try {
      const pedido = await this.http.get<any>(`${API_URL}/orders/${this.id}`).toPromise();
      this.remitenteSeleccionado = pedido.senderId;
      this.destinatarioSeleccionado = pedido.receiverId;
      this.totalBultos = pedido.totalPackages;
      this.pesoTotal = pedido.totalWeight;
      if (pedido.deliveryDate) {
        this.fechaEntrega = new Date(pedido.deliveryDate).toISOString().split('T')[0]; // solo la fecha (sin la hora)
      }
    } catch (err: any) {
      this.error = err?.error?.message || 'Error al cargar el pedido. Inténtelo de nuevo.';
      console.error(this.error);
    }
  }

  onFechaEntregaChange(): void {
    if (this.fechaEntrega) {
      // Convertir la fecha seleccionada en formato ISO
      const fechaISO = new Date(this.fechaEntrega).toISOString();
      this.fechaEntrega = fechaISO;
    }
  }

   // Función que se llama al hacer clic en el botón
   manejarAccion(): void {
    if (this.esModoEditar) {
      this.editarPedido();
    } else {
      this.crearPedido();
    }
  }

  redirectPedidos(){
    this.router.navigate(['/pedidos']);
  }

}
