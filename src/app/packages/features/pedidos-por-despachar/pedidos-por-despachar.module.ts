import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PedidosPorDespacharComponent } from './pedidos-por-despachar.component';

const routes: Routes = [
  { path: '', component: PedidosPorDespacharComponent }, 
];

@NgModule({
  declarations: [],
  imports: [
    PedidosPorDespacharComponent,
    CommonModule,
    RouterModule.forChild(routes), 
  ],
  exports: [
    PedidosPorDespacharComponent
  ]
})
export class PedidosPorDespacharModule {}