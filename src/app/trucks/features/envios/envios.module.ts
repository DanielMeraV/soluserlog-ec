import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EnviosComponent } from './envios.component';

const routes: Routes = [
  { path: '', component: EnviosComponent }, 
];

@NgModule({
  declarations: [],
  imports: [
    EnviosComponent,
    CommonModule,
    RouterModule.forChild(routes), 
  ],
  exports: [
    EnviosComponent
  ]
})
export class EnviosModule {}