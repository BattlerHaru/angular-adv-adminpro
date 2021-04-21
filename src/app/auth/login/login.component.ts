import { Component, NgZone, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import swal from 'sweetalert2';

// Para usar el script se declara y a la vez se requiere un onInit
declare const gapi: any

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css',
  ]
})
export class LoginComponent implements OnInit {

  public formSubmitted = false;
  public auth2: any;

  public loginForm = this.fb.group({
    email: [localStorage.getItem('email') || 'test@test.com', [Validators.required, Validators.email]],
    password: ['123456', [Validators.required]],
    remember: [false]
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.renderButton();
  }

  // Realizar el posteo
  login() {
    this.usuarioService.login(this.loginForm.value)
      .subscribe(resp => {
        if (this.loginForm.get('remember').value) {
          localStorage.setItem('email', this.loginForm.get('email').value);
        } else {
          localStorage.removeItem('email');
        }
        // navegar al dashboard
        this.router.navigateByUrl('/');
      }, (err) => {
        // En caso de error
        swal.fire('Error', err.error.msg, 'error');
      }
      )
  }

  // Google
  // Nota para manejar el onSuccess y onFailure se pierden la referencia del this, por lo que se realizara de manera diferente

  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
    });

    this.startApp();

  }

  async startApp() {

    await this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;

    this.attachSignin(document.getElementById('my-signin2'));

  };

  attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {
        const id_token = googleUser.getAuthResponse().id_token;
        this.usuarioService.loginGoogle(id_token).subscribe(
          resp => {
            // navegar al dashboard
            this.ngZone.run(() => {
              this.router.navigateByUrl('/');
            });
          }
        );

      }, (error) => {
        alert(JSON.stringify(error, undefined, 2));
      });
  }

}
