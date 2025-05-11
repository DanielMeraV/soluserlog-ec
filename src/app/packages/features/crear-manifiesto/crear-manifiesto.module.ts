import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CrearManifiestoComponent } from './crear-manifiesto.component';

const routes: Routes = [
  { path: '', component: CrearManifiestoComponent }, 
];

@NgModule({
  declarations: [],
  imports: [
    CrearManifiestoComponent,
    CommonModule,
    RouterModule.forChild(routes), 
  ],
  exports: [
    CrearManifiestoComponent
  ]
})
export class CrearManifiestoModule {}