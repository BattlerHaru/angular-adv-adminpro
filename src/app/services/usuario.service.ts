import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Observable, of } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

import { RegisterForm } from '../interfaces/register.form.interface';
import { LoginForm } from '../interfaces/login.form.interface';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interfaces';

import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

declare const gapi: any;

@Injectable({
  providedIn: 'root'
})


export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

  constructor(private http: HttpClient, private router: Router,
    private ngZone: NgZone) {
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario.uid || '';
  }

  get headers(): object {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  googleInit() {
    return new Promise(resolve => {
      gapi.load('auth2', () => {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id: '494122777686-sgl00uvjad0nv9p4t0rfko06bcd5jitr.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });
        resolve('');
      });

    })

  }

  logout() {
    localStorage.removeItem('token');
    this.auth2.signOut().then(() => {

      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      })

    });
  }

  validarToken(): Observable<boolean> {
    const url = `${base_url}/login/renew`;
    return this.http.get(url, this.headers)
      .pipe(
        map((resp: any) => {
          const {
            email,
            google,
            nombre,
            role,
            img = '',
            uid,
          } = resp.usuario;

          this.usuario = new Usuario(nombre, email, '', img, google, role, uid);

          console.log(resp.token);

          localStorage.setItem('token', resp.token);

          return true;
        }),
        catchError(error => of(false))
      );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
        })
      );
  }

  // Seria mejor utilizar una interfaz
  actualizarPerfil(data: { email: string, nombre: string, role: string }) {
    // localhost:3000/api/usuarios/id
    const url = `${base_url}/usuarios/${this.uid}`;

    data = {
      ...data,
      role: this.usuario.role
    }

    return this.http.put(url, data, this.headers);
  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData)
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
        })
      );
  }

  loginGoogle(token) {
    return this.http.post(`${base_url}/login/Google`, { token })
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token);
        })
      );
  }

  cargarUsuarios(desde: number = 0) {
    // localhost:3000/api/usuarios?desde=5
    const url = `${base_url}/usuarios?desde=${desde}`;

    return this.http.get<CargarUsuario>(url, this.headers)
      .pipe(
        map(resp => {
          const usuarios = resp.usuarios.map(
            user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
          );

          return {
            total: resp.total,
            usuarios: usuarios
          };

        }
        ),
      );
  }

  eliminarUsuario(usuario: Usuario) {
    // localhost:3000/api/usuarios/id
    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete(url, this.headers);
  }

  actualizarRole(usuario: Usuario) {
    // localhost:3000/api/usuarios/id
    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.http.put(url, usuario, this.headers);
  }

}
