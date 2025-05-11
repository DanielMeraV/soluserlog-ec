import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { ReactiveFormsModule } from '@angular/forms'; 
import { LoginComponent } from './login.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', component: LoginComponent }, 
];

@NgModule({
  imports: [
    LoginComponent,
    CommonModule,      // Necesario para directivas comunes como ngIf, ngFor
    ReactiveFormsModule, // Importa ReactiveFormsModule si lo usas en LoginComponent
    HttpClientModule,
    RouterModule.forChild(routes), 
  ],
  exports: [
    LoginComponent // Exporta el componente Login para que se pueda usar en otros módulos si es necesario
  ]
})
export class LoginModule { }
