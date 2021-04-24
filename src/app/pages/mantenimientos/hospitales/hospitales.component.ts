import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { HospitalService } from '../../../services/hospital.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { BusquedasService } from '../../../services/busquedas.service';

import { Hospital } from '../../../models/hospital.model';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {

  public hospitales: Hospital[] = [];
  public hospitalesTemp: Hospital[] = [];

  public cargando: boolean = true;
  private imgSubs: Subscription;

  constructor(
    private hospitalService: HospitalService,
    private modalImagenService: ModalImagenService,
    private busquedasService: BusquedasService) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(delay(100))
      .subscribe(img => this.cargarHospitales());
  }

  buscar(termino: string) {

    if (termino.length === 0) {
      return this.hospitales = this.hospitalesTemp;
    }

    this.busquedasService.buscar('hospitales', termino)
      .subscribe((resp: Hospital[]) => {
        this.hospitales = resp;
      });
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales()
      .subscribe(
        resp => {
          this.hospitales = resp;
          this.hospitalesTemp = resp;
          this.cargando = false;
        }
      );
  }

  guardarCambios(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital._id, hospital.nombre)
      .subscribe(
        resp => {
          Swal.fire('Guardado con exito', hospital.nombre, 'success');
        }
      );
  }

  eliminarHospital(hospital: Hospital) {
    Swal.fire({
      title: `¿Desea eliminar a:  ${hospital.nombre}?`,
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
        this.hospitalService.borrarHospital(hospital._id)
          .subscribe(
            resp => {
              this.cargarHospitales()
              Swal.fire('Hospital eliminado con exito', 'Se elimino: ' + hospital.nombre, 'success');
            }
          );
      }
    });
  }

  async abrirSweetAlert() {

    const { value = '' } = await Swal.fire<string>({
      title: 'Nuevo hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    });

    if (value.trim().length > 0) {
      this.hospitalService.crearHospital(value).subscribe((resp: any) => {
        Swal.fire('Hospital registrado con exito', 'Se registro a: ' + value, 'success');
        // Para hacerlo de otra manera evitando hacer la peticion
        // this.cargarHospitales();
        this.hospitales.push(resp.hospital);
      });

    }

  }

  abrirModal(hospital: Hospital) {
    this.modalImagenService.abrirModal('hospitales', hospital._id, hospital.img);
  }

}
