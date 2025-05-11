import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BitacorasComponent } from './bitacoras.component';

const routes: Routes = [
  { path: '', component: BitacorasComponent }, 
];

@NgModule({
  declarations: [],
  imports: [
    BitacorasComponent,
    CommonModule,
    RouterModule.forChild(routes), 
  ],
  exports: [
    BitacorasComponent
  ]
})
export class BitacorasModule {}
