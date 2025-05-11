import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ManifiestosComponent } from './manifiestos.component';

const routes: Routes = [
  { path: '', component: ManifiestosComponent }, 
];

@NgModule({
  declarations: [],
  imports: [
    ManifiestosComponent,
    CommonModule,
    RouterModule.forChild(routes), 
  ],
  exports: [
    ManifiestosComponent
  ]
})
export class ManifiestosModule {}