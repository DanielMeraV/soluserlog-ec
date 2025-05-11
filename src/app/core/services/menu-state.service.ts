import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuStateService {
  private activeMenu: string | null = null;
  private activeSubMenu: string | null = null;
  private arrowStates: { [menuId: string]: boolean } = {}; // true: down, false: right

  setActiveMenu(menuId: string | null) {
    this.activeMenu = menuId;
  }

  getActiveMenu(): string | null {
    return this.activeMenu;
  }

  setActiveSubMenu(subMenuId: string | null) {
    this.activeSubMenu = subMenuId;
  }

  getActiveSubMenu(): string | null {
    return this.activeSubMenu;
  }

  setArrowState(menuId: string, isDown: boolean) {
    this.arrowStates[menuId] = isDown;
  }

  getArrowState(menuId: string): boolean {
    if (this.arrowStates[menuId] === undefined) {
      this.arrowStates[menuId] = false;
    }
    return this.arrowStates[menuId];
  }
}
