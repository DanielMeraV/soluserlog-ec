import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../components/sidebar/sidebar.component";
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import API_URL from '../../../core/config/config';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pedidos-por-despachar',
  imports: [SidebarComponent, HttpClientModule, CommonModule],
  templateUrl: './pedidos-por-despachar.component.html',
  styleUrl: './pedidos-por-despachar.component.css'
})
export class PedidosPorDespacharComponent implements OnInit {

  pedidos: any[] = [];
  error: string | null = null;

  constructor(private router: Router, private http: HttpClient) { } 

  redirectCrearManifiesto(){
    this.router.navigate(['/crear-manifiesto']);
  }

  async ngOnInit(): Promise<void> {
    try {
      const response: any = await this.http.get(`${API_URL}/orders/`).toPromise();
      this.pedidos = response.filter((pedido: any) => pedido.state === 'toBeDispatched');
    } catch (err: any) {
      this.error = err?.error?.message || 'Error al cargar los pedidos.';
      console.error('Error al obtener los pedidos:', this.error);
    }
  }
}
