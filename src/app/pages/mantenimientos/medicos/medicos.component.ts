import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';


import { MedicoService } from '../../../services/medico.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';

import { Medico } from '../../../models/medico.model';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public medicos: Medico[] = [];
  public medicosTemp: Medico[] = [];

  public cargando: boolean = true;
  private imgSubs: Subscription;


  constructor(
    private medicoService: MedicoService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService,
  ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe(img => this.cargarMedicos());
  }

  buscar(termino: string) {

    if (termino.length === 0) {
      return this.medicos = this.medicosTemp;
    }

    this.busquedasService.buscar('medicos', termino)
      .subscribe((resp: Medico[]) => {
        this.medicos = resp;
      });
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos()
      .subscribe(
        resp => {
          this.medicos = resp;
          this.medicosTemp = resp;
          this.cargando = false;
        }
      );
  }

  abrirModal(medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img);
  }


  eliminarMedico(medico: Medico) {
    Swal.fire({
      title: `¿Desea eliminar a:  ${medico.nombre}?`,
      text: 'Esta accion no se puede deshacer...',
      icon: 'question',
      showDenyButton: true,
      denyButtonText: 'Cancelar',
      denyButtonColor: 'red',
      focusDeny: true,
      confirmButtonText: `Si, borrarlo`,
      confirmButtonColor: 'grey',
    }).then((result) => {
      if (result.value) {
        this.medicoService.borrarMedico(medico._id)
          .subscribe(
            resp => {
              this.cargarMedicos()
              Swal.fire('Medico eliminado con exito', 'Se elimino: ' + medico.nombre, 'success');
            }
          );
      }
    });
  }


}
