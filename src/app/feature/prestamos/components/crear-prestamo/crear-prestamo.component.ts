import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotifierService } from '@core/components/notifier/notifier.service';
import { Prestamo } from '../../shared/model/prestamo';
import { PrestamoService } from '../../shared/service/prestamo.service';

const LONGITUD_MINIMA_PERMITIDA_CEDULA = 10;
const LONGITUD_MINIMA_PERMITIDA_TEXTO = 3;
const LONGITUD_MAXIMA_PERMITIDA_TEXTO = 20;
const UNO = 1;
const NUEVE = 9;
const ERROR_SERVIDOR = 'Se presento un error en el servidor: Codigo ';
const VALIDAR_CAMPOS = 'Debe validar los campos obligatorios.';

@Component({
  selector: 'app-crear-prestamo',
  templateUrl: './crear-prestamo.component.html'
})

export class CrearPrestamoComponent implements OnInit {

  prestamoForm: FormGroup;
  fechaActualVista: string;
  prestamo: Prestamo;
  ok: string;
  success: string;
  error: string;


  constructor(protected prestamoService: PrestamoService,
              private notifierService: NotifierService) { }

  ngOnInit() {
    this.construirFormularioPrestamos();
    this.iniciarVaribales();

  }

  iniciarVaribales(){
    this.cargarFecha();
    this.ok = 'ok';
    this.success = 'success';
    this.error = 'error';
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
    const fechaActual = new Date;
    const anualidad = fechaActual.getFullYear();
    const mes = ((fechaActual.getMonth() + UNO) > NUEVE ? (fechaActual.getMonth() + UNO) : `0${(fechaActual.getMonth() + UNO)}`);
    const dia = (fechaActual.getDate() > NUEVE ? fechaActual.getDate() : `0${fechaActual.getDate()}`);
    this.fechaActualVista = `${anualidad}-${mes}-${dia}`;
  }

  cerrar() {
    if (this.prestamoForm.status !== 'INVALID') {
      this.prestamo = new Prestamo(null, this.prestamoForm.get('cedula').value,
        this.prestamoForm.get('equipoComputo').value, this.fechaActualVista, null, null);
      this.consumoGuardarSolicitud();
    } else {
      this.notifierService.showNotification(VALIDAR_CAMPOS, this.ok, this.error);
    }
  }

  consumoGuardarSolicitud() {
    this.prestamoService.guardar(this.prestamo)
      .subscribe(solicitud => {
        const respuesta = JSON.parse(JSON.stringify(solicitud));
        this.notifierService.showNotification(respuesta.valor, this.ok, this.success);
      },
        error => {
          const errorRespuesta = JSON.parse(JSON.stringify(error));
          if (errorRespuesta.error.mensaje !== undefined) {
            this.notifierService.showNotification(errorRespuesta.error.mensaje, this.ok, this.error);
          } else {
            this.notifierService.showNotification(ERROR_SERVIDOR + errorRespuesta.status, this.ok, this.error);
          }
        });
  }

}
