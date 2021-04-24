import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { Hospital } from '../models/hospital.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor(private http: HttpClient) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers(): object {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  cargarHospitales() {
    // localhost:3000/api/hospitales
    const url = `${base_url}/hospitales`;

    // Este es similar al de matenimiento de usuario pero no se van a crear instancias de los hospitales
    return this.http.get(url, this.headers)
      .pipe(
        map(
          (resp:
            { ok: boolean, hospitales: Hospital[] }
          ) => resp.hospitales),
      );

  }

  crearHospital(nombre: string) {
    // localhost:3000/api/hospitales
    const url = `${base_url}/hospitales`;

    return this.http.post(url, { nombre }, this.headers);
  }

  actualizarHospital(_id: string, nombre: string) {
    // localhost:3000/api/hospitales/id
    const url = `${base_url}/hospitales/${_id}`;

    return this.http.put(url, { nombre }, this.headers);
  }

  borrarHospital(_id: string) {
    // localhost:3000/api/hospitales/id
    const url = `${base_url}/hospitales/${_id}`;

    return this.http.delete(url, this.headers);
  }


}
