import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TruckMapComponent } from './truck-map.component';

const routes: Routes = [
  { path: '', component: TruckMapComponent }, 
];

@NgModule({
  declarations: [],
  imports: [
    TruckMapComponent,
    CommonModule,
    RouterModule.forChild(routes),  
  ],
  exports: [
    TruckMapComponent
  ]
})
export class TruckMapModule {}
