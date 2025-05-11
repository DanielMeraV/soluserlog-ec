import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import API_URL from '../../core/config/config';
import { MenuStateService } from '../../core/services/menu-state.service';
import { LocationService } from '../../core/services/location.service'; 

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  error: string = '';
  activeMenu: string | null = null; 
  activeSubMenu: string | null = null; 
  
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private menuStateService: MenuStateService,
    private locationService: LocationService
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.locationService.destroy();
    this.cleanMenuAndSubMenu();
  }

  async handleLogin() {
    if (this.loginForm.invalid) {
      this.error = 'Por favor complete todos los campos.';
      return;
    }

    const { username, password } = this.loginForm.value;

    try {
      const response: any = await this.http
        .post(`${API_URL}/auth/login`, { username, password })
        .toPromise();

      if (response) {
        sessionStorage.setItem('username', response.username);
        sessionStorage.setItem('userType', response.userType);

        console.log('Usuario autenticado:', response.username);
        this.router.navigate(['/dashboard']);
      }
    } catch (err: any) {
      this.error = err?.error?.message || 'Error al conectar con el servidor. Inténtelo de nuevo.';
    }
  }

  cleanMenuAndSubMenu(){
    this.activeMenu = null;
    this.activeSubMenu = null;
    this.menuStateService.setActiveMenu(this.activeMenu);
    this.menuStateService.setActiveSubMenu(this.activeSubMenu);
  }
}
