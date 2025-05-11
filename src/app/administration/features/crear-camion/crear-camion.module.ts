import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CrearCamionComponent } from './crear-camion.component';

const routes: Routes = [
  { path: '', component: CrearCamionComponent }, 
];

@NgModule({
  declarations: [],
  imports: [
    CrearCamionComponent,
    CommonModule,
    RouterModule.forChild(routes), 
  ],
  exports: [
    CrearCamionComponent
  ]
})
export class CrearCamionModule { }
