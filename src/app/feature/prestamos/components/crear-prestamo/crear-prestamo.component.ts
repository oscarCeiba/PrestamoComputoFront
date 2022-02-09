import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from '@core/components/notifier/notifier.service';
import { Prestamo } from '../../shared/model/prestamo';
import { PrestamoService } from '../../shared/service/prestamo.service';

const LONGITUD_MINIMA_PERMITIDA_CEDULA = 10;
const LONGITUD_MINIMA_PERMITIDA_TEXTO = 3;
const LONGITUD_MAXIMA_PERMITIDA_TEXTO = 20;
const ERROR_SERVIDOR = "Se presento un error en el servidor: Codigo ";
const VALIDAR_CAMPOS = "Debe validar los campos obligatorios.";
const OK = "ok";
const SUCCESS = "success";
const ERROR = "error";

@Component({
  selector: 'app-crear-prestamo',
  templateUrl: './crear-prestamo.component.html',
  styleUrls: ['./crear-prestamo.component.css']
})

export class CrearPrestamoComponent implements OnInit {

  prestamoForm: FormGroup;
  fechaActualVista: string;
  prestamo: Prestamo;
  respuesta: any;


  constructor(protected prestamoService: PrestamoService,
    private notifierService: NotifierService) { }

  ngOnInit() {
    this.construirFormularioPrestamos();
    this.cargarFecha();
  }

  private construirFormularioPrestamos() {
    this.prestamoForm = new FormGroup({
      cedula: new FormControl('', [Validators.required, Validators.minLength(LONGITUD_MINIMA_PERMITIDA_CEDULA),
      Validators.maxLength(LONGITUD_MINIMA_PERMITIDA_CEDULA)]),
      equipoComputo: new FormControl('', [Validators.required, Validators.minLength(LONGITUD_MINIMA_PERMITIDA_TEXTO),
      Validators.maxLength(LONGITUD_MAXIMA_PERMITIDA_TEXTO)])
    });
  }

  private cargarFecha() {
    let fechaActual = new Date;
    this.fechaActualVista = fechaActual.getFullYear() + '-'
      + ((fechaActual.getMonth() + 1) > 9 ? (fechaActual.getMonth() + 1) : '0'
        + (fechaActual.getMonth() + 1)) + '-'
      + (fechaActual.getDate() > 9 ? fechaActual.getDate() : '0'
        + fechaActual.getDate());
  }

  cerrar() {
    if (this.prestamoForm.status !== 'INVALID') {
      this.prestamo = new Prestamo(null, this.prestamoForm.get('cedula').value,
        this.prestamoForm.get('equipoComputo').value, this.fechaActualVista, null, null);
      this.consumoGuardarSolicitud();
    } else {
      this.notifierService.showNotification(VALIDAR_CAMPOS, OK, ERROR);
    }
  }

  consumoGuardarSolicitud() {
    this.prestamoService.guardar(this.prestamo)
      .subscribe(solicitud => {
        this.respuesta = JSON.parse(JSON.stringify(solicitud));
        this.notifierService.showNotification(this.respuesta.valor, OK, SUCCESS);
      },
        error => {
          let errorRespuesta = JSON.parse(JSON.stringify(error));
          if (errorRespuesta.error.mensaje != undefined) {
            this.notifierService.showNotification(errorRespuesta.error.mensaje, OK, ERROR);
          } else {
            this.notifierService.showNotification(ERROR_SERVIDOR + errorRespuesta.status, OK, ERROR);
          }
        })
  }

}
