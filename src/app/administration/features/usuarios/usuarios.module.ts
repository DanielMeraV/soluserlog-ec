import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosComponent } from './usuarios.component';

const routes: Routes = [
  { path: '', component: UsuariosComponent }, 
];

@NgModule({
  declarations: [],
  imports: [
    UsuariosComponent,
    CommonModule,
    RouterModule.forChild(routes), 
  ],
   exports: [
     UsuariosComponent
   ]
})
export class UsuariosModule { }
