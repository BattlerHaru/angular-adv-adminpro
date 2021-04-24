import { Injectable } from '@angular/core';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  constructor() {
    this.cargarMenu();
  }

  public menu: [];

  cargarMenu() {
    // Como esto es un string lo convertimos nuevamente
    this.menu =
      JSON.parse(localStorage.getItem('menu')) || [];
  }

}
