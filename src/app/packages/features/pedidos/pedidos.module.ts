import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PedidosComponent } from './pedidos.component';

const routes: Routes = [
  { path: '', component: PedidosComponent }, 
];

@NgModule({
  declarations: [],
  imports: [
    PedidosComponent,
    CommonModule,
    RouterModule.forChild(routes), 
  ],
  exports: [
    PedidosComponent
  ]
})
export class PedidosModule {}
