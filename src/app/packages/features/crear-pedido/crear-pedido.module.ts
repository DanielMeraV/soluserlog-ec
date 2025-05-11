import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CrearPedidoComponent } from './crear-pedido.component';

const routes: Routes = [
  { path: '', component: CrearPedidoComponent }, 
];

@NgModule({
  declarations: [],
  imports: [
    CrearPedidoComponent,
    CommonModule,
    RouterModule.forChild(routes), 
  ],
  exports: [
    CrearPedidoComponent
  ]
})
export class CrearPedidosModule {}
