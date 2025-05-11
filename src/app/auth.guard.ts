import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const userType = sessionStorage.getItem('userType');

    if (userType) {
      // Si ya está logueado y trata de entrar al login, redirige al dashboard
      if (state.url === '/login') {
        return this.router.parseUrl('/dashboard');
      }
      return true; // Permite acceso
    } else {
      // Si no está logueado y no es la ruta de login, redirige
      if (state.url !== '/login') {
        return this.router.parseUrl('/login');
      }
      return true; // Permite ir al login
    }
  }
}
