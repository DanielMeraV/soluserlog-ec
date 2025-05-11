import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ClientMapComponent } from './client-map.component';

const routes: Routes = [
  { path: '', component: ClientMapComponent }, 
];

@NgModule({
  declarations: [],
  imports: [
    ClientMapComponent,
    CommonModule,
    RouterModule.forChild(routes),  
  ],
  exports: [
    ClientMapComponent
  ]
})
export class ClientMapModule {}
