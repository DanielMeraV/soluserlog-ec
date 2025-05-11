import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CrearClienteComponent } from './crear-cliente.component';

const routes: Routes = [
  { path: '', component: CrearClienteComponent }, 
];

@NgModule({
  declarations: [],
  imports: [
    CrearClienteComponent,
    CommonModule,
    RouterModule.forChild(routes), 
  ],
  exports: [
    CrearClienteComponent
  ]
})
export class CrearClienteModule { }
