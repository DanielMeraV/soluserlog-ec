import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CamionesComponent } from './camiones.component';

const routes: Routes = [
  { path: '', component: CamionesComponent }, 
];

@NgModule({
  declarations: [],
  imports: [
    CamionesComponent,
    CommonModule,
    RouterModule.forChild(routes), 
  ],
  exports: [
    CamionesComponent
  ]
})
export class CamionesModule { }
