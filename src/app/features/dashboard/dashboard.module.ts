import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  { path: '', component: DashboardComponent }, 
];

@NgModule({
  declarations: [],
  imports: [
    DashboardComponent,
    CommonModule,
    RouterModule.forChild(routes), 
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule {}

