import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DetallesBitacoraComponent } from './detalles-bitacora.component';

const routes: Routes = [
  { path: '', component: DetallesBitacoraComponent }, 
];

@NgModule({
  declarations: [],
  imports: [
    DetallesBitacoraComponent,
    CommonModule,
    RouterModule.forChild(routes),  
  ],
  exports: [
    DetallesBitacoraComponent
  ]
})
export class DetallesBitacoraModule {}