import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CrearBitacoraComponent } from './crear-bitacora.component';

const routes: Routes = [
  { path: '', component: CrearBitacoraComponent }, 
];

@NgModule({
  declarations: [],
  imports: [
    CrearBitacoraComponent,
    CommonModule,
    RouterModule.forChild(routes), 
  ],
  exports: [
    CrearBitacoraComponent
  ]
})
export class CrearBitacoraModule {}