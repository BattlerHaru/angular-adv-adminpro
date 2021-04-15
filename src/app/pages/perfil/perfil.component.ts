import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { UsuarioService } from '../../services/usuario.service';
import { FileUploadService } from '../../services/file-upload.service';

import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm: FormGroup;
  public usuario: Usuario
  public imagenSubir: File;
  public imgTemp: any;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private fileUploadService: FileUploadService
  ) {
    this.usuario = usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      email: [this.usuario.email, [Validators.required, Validators.email]],
      nombre: [this.usuario.nombre, Validators.required],
    });
  }

  actualizarPerfil() {

    this.usuarioService.actualizarPerfil(this.perfilForm.value)
      .subscribe(() => {
        const { nombre, email } = this.perfilForm.value;
        this.usuario.nombre = nombre;
        this.usuario.email = email;

        Swal.fire(
          'Excelente',
          'Datos actualizados',
          'success'
        );
      }, (err) => {
        Swal.fire(
          'Algo salio mal...',
          err.error.msg,
          'error'
        );
      });
  }

  cambiarImagen(file: File) {
    this.imagenSubir = file;

    // previsualizar la imagen
    if (!file) { return this.imgTemp = null }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }

  }

  subirImagen() {
    this.fileUploadService.actualizarFoto(
      this.imagenSubir,
      'usuarios',
      this.usuario.uid
    )
      .then(img => {
        this.usuario.img = img;
        Swal.fire(
          'Excelente',
          'Imagen actualizada',
          'success'
        );
      })
      .catch(
        err => {
          Swal.fire(
            'Algo salio mal...',
            'Error al actualizar la imagen',
            'error'
          );
        }
      );

  }

}
