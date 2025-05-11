import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CrearUsuarioComponent } from './crear-usuario.component';

const routes: Routes = [
  { path: '', component: CrearUsuarioComponent }, 
];

@NgModule({
  declarations: [],
  imports: [
    CrearUsuarioComponent,
    CommonModule,
    RouterModule.forChild(routes), 
  ],
  exports: [
    CrearUsuarioComponent
  ]
})
export class CrearUsuarioModule { }
