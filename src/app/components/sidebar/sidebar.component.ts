import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuStateService } from '../../core/services/menu-state.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  imports: [CommonModule]
})
export class SidebarComponent {
  activeMenu: string | null = null;  // Menú principal activo
  activeSubMenu: string | null = null;  // Submenú activo
  rightArrow = '/assets/icon-right-arrow.png';
  username: string | null = '';
  userType: string | null = '';
  isSidebarOpen: boolean = true;

  constructor(private router: Router, private menuStateService: MenuStateService) { }

  ngOnInit() {
    this.activeMenu = this.menuStateService.getActiveMenu();
    this.activeSubMenu = this.menuStateService.getActiveSubMenu();
    this.username = sessionStorage.getItem('username');
    this.userType = sessionStorage.getItem('userType');

    // Restaurar el estado de las flechas
    const menuElements = document.querySelectorAll('.menu > li');
    menuElements.forEach((menuElement) => {
      const menuId = menuElement.getAttribute('id');
      if (menuId) {
        const isDown = this.menuStateService.getArrowState(menuId);

        if (isDown) {
          menuElement.classList.add('active');
        } else {
          menuElement.classList.remove('active');
        }
      }
    });

    // Mostrar sidebar por defecto en pantallas grandes
    this.isSidebarOpen = window.innerWidth >= 768; // 768px ≈ md

    window.addEventListener('resize', this.onResize.bind(this));
  }

  onResize() {
    const isWideScreen = window.innerWidth >= 768;
    this.isSidebarOpen = isWideScreen ? true : this.isSidebarOpen;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  toggleMenu(menuId: string) {
    const menuElement = document.getElementById(menuId);
    if (menuElement) {
      menuElement.classList.toggle('active');
    }
    this.menuStateService.setActiveMenu(this.activeMenu);
  }

  toggleSubMenu(subMenuId: string) {
    const subMenuElement = document.getElementById(subMenuId);
    if (subMenuElement) {
      subMenuElement.classList.toggle('active');
    }
    this.activeSubMenu = subMenuId;
    this.menuStateService.setActiveSubMenu(this.activeSubMenu);

  }

  cleanMenuAndSubMenu() {
    this.activeMenu = null;
    this.activeSubMenu = null;
    this.menuStateService.setActiveMenu(this.activeMenu);
    this.menuStateService.setActiveSubMenu(this.activeSubMenu);
  }

  onLinkClick(event: MouseEvent, menuId: string) {
    event.preventDefault();

    const isCurrentlyActive = this.activeMenu === menuId;
    this.activeMenu = isCurrentlyActive ? null : menuId;

    this.toggleMenu(menuId);
  }


  redirectClientes() {
    this.router.navigate(['/clientes']);
  }
  redirectUsuarios() {
    this.router.navigate(['/usuarios']);
  }
  redirectCamiones() {
    this.router.navigate(['/camiones']);
  }

  redirectPedidos() {
    this.router.navigate(['/pedidos']);
  }
  redirectDashboard() {
    this.router.navigate(['/dashboard']);
  }
  redirectPedidosPorDespachar() {
    this.router.navigate(['/pedidos-por-despachar']);
  }
  redirectManifiestos() {
    this.router.navigate(['/manifiestos']);
  }

  redirectTestMap() {
    this.router.navigate(['/test-map']);
  }
  redirectEnvios() {
    this.router.navigate(['/envios']);
  }
  redirectBitacoras() {
    this.router.navigate(['/bitacoras']);
  }
  redirectUbicacion() {
    this.router.navigate([`/truck-map/${localStorage.getItem('currentTruckId')}`]);
  }

  logout() {
    // Limpia datos de sesión
    localStorage.clear();
    sessionStorage.clear();
    this.cleanMenuAndSubMenu();

    // Redirige a la pantalla de login
    this.router.navigate(['/login']);
  }

}
