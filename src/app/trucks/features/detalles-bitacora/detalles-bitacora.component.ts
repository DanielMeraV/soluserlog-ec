import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../components/sidebar/sidebar.component";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import API_URL from '../../../core/config/config';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface DetalleBitacora {
  logbookId: string,
  orderId: string;
  temperature: string;
  humidity: number | null;
  deliveryTime: number | null;
  deliveryPhoto: string;
  remarks: any;
}

interface FormData {
  orderId: string,
  remitente: string;
  destinatario: string;
  temperatura: number | null;
  humedad: number | null;
  horaEntrega: string;
  fotoEntrega: any;
  novedades: string;
  bloqueado: boolean;
}


@Component({
  selector: 'app-detalles-bitacora',
  imports: [SidebarComponent, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './detalles-bitacora.component.html',
  styleUrl: './detalles-bitacora.component.css'
})
export class DetallesBitacoraComponent implements OnInit {
  bitacora: any = {};
  manifiesto: any = {};
  clientes: any = [];
  orders: any = [];
  detallesbitacora: any = {};
  id: string | null = '';
  formData: FormData[] = [];
  error: string | null = null;


  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private http: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    try {
      await this.setDefaultValues();
    } catch (err) {
      console.error('Error al cargar los datos de la bitácora:', err);
    }
  }

  async setDefaultValues() {
    try {
      // Obtener ID de la bitácora
      this.id = this.route.snapshot.paramMap.get('idBitacora');
      if (!this.id) throw new Error('No se encontró el ID de la bitácora');

      // Cargar bitácora
      const bitacoraResponse: any = await this.http.get(`${API_URL}/logbook/${this.id}`).toPromise();
      this.bitacora = bitacoraResponse;

      // Cargar detalles bitacora
      const detallesBitacoraResponse: any = await this.http.get(`${API_URL}/logbook-details/`).toPromise();    
      this.detallesbitacora = detallesBitacoraResponse.filter((detalle: any) => detalle.logbookId === this.bitacora.id);
      const detallesMap = new Map(this.detallesbitacora.map((detalle: any) => [detalle.orderId, detalle]));

      // Cargar manifiesto
      const manifiestoResponse = await this.http.get(`${API_URL}/manifestos/${this.bitacora.manifestoId}`).toPromise();
      this.manifiesto = manifiestoResponse;

      // Cargar todos los clientes primero
      const clientesResponse: any = await this.http.get<any>(`${API_URL}/customers/`).toPromise() || [];
      this.clientes = clientesResponse;

      // Cargar y filtrar órdenes
      const ordersResponse: any = await this.http.get<any>(`${API_URL}/orders/`).toPromise();
      this.orders = ordersResponse.filter((order: any) => order.manifestoId === this.manifiesto.id);   
      
      //this.comprobarEntregas();

      this.formData = this.orders.map((order: any) => {
        const remitenteCliente = this.clientes.find((c: any) => c.id === order.senderId);
        const destinatarioCliente = this.clientes.find((c: any) => c.id === order.receiverId);
        const detalle = detallesMap.get(order.id) as DetalleBitacora || {
          logbookId: "",
          orderId: order.id,
          temperature: "",
          humidity: null,
          deliveryTime: null,
          deliveryPhoto: "",
          remarks: null,
      };

        return {
            orderId: order.id, // Usar siempre el orderId de la orden
            remitente: remitenteCliente?.companyName || `Cliente ${order.senderId}`,
            destinatario: destinatarioCliente?.companyName || `Cliente ${order.receiverId}`,
            temperatura: detalle.temperature ?? null,
            humedad: detalle.humidity ?? null,
            horaEntrega: detalle.deliveryTime ?? '',
            fotoEntrega: detalle.deliveryPhoto ?? null,
            novedades: detalle.remarks ?? '',
            bloqueado: order.state === 'delivered'
        };
    });

    } catch (error) {
      console.error('Error en setDefaultValues:', error);
      throw error;
    }
  }

  onFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file && this.formData[index]) {
      this.formData[index].fotoEntrega = file;
    }
  }

  async guardarEntrega(index: number, orderId: number) {
    if (!this.formData[index].temperatura || !this.formData[index].humedad || !this.formData[index].horaEntrega) {
      alert('Por favor, complete todos los campos de temperatura, humedad, hora de entrega y foto de entrega.');
      return;
    }

    if (isNaN(this.formData[index].temperatura) || isNaN(this.formData[index].humedad)){
      alert('Por favor, ingrese un valor numérico entero en la temperatura y humedad.');
      return;
    }

    const idBitacora = this.route.snapshot.paramMap.get('idBitacora');
    const nuevoDetalleBitacora = {
      logbookId: idBitacora,
      orderId: orderId,
      temperature: this.formData[index].temperatura,
      humidity: this.formData[index].humedad,
      deliveryTime: this.formData[index].horaEntrega,
      deliveryPhoto: '',//this.formData[index].fotoEntrega,
      remarks: this.formData[index].novedades
    }; 

    try {
      let response: any = await this.http.post(`${API_URL}/logbook-details/`, nuevoDetalleBitacora).toPromise();
      console.log('Detalle de bitacora creado exitosamente:', response);

      this.formData[index].bloqueado = true;

       response = await this.http.put(`${API_URL}/orders/${orderId}`, { state: 'delivered' }).toPromise();

       const ordersResponse: any = await this.http.get<any>(`${API_URL}/orders/`).toPromise();
       this.orders = ordersResponse.filter((order: any) => order.manifestoId === this.manifiesto.id);   
       //this.comprobarEntregas();
      
    } catch (err: any) {
      this.error = err?.error?.message || 'Error al crear el pedido. Inténtelo de nuevo.';
      console.error(this.error);
    }

  }

  async comprobarEntregas(){
    if (this.orders && this.orders.length > 0) {
      const todasEntregadas = this.orders.every((order: any) => order.state === 'delivered');
      if (todasEntregadas) {
        this.redirectBitacoras();
      }
    } 
  }
  
  redirectBitacoras(){
    this.router.navigate(['/bitacoras/']);
  }

  limpiarFormulario(index: number) {
    if (this.formData[index]) {
      const remitente = this.formData[index].remitente;
      const destinatario = this.formData[index].destinatario;
      const bloqueo = this.formData[index].bloqueado;
      const order = this.formData[index].orderId;
      
      if(!bloqueo){
        this.formData[index] = {
          orderId: order,
          remitente,
          destinatario,
          temperatura: null,
          humedad: null,
          horaEntrega: '',
          fotoEntrega: null,
          novedades: '',
          bloqueado: bloqueo
        };
      }
    }
  }

  verUbicacionDestino(orderId: number, tipo: string){
    localStorage.setItem('previousUrl', this.router.url);
    const order = this.orders.find((o: any) => o.id === orderId);
    let Cliente: any = null;

    if(tipo==='remitente') Cliente = this.clientes.find((c: any) => c.id === order.senderId);
    else if(tipo==='destinatario') Cliente = this.clientes.find((c: any) => c.id === order.receiverId);
    this.router.navigate([`/client-map/${Cliente.id}`]);
  }

}