import { Component, OnInit } from '@angular/core';
import { Prestamo } from '../../shared/model/prestamo';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotifierService } from '@core/components/notifier/notifier.service';
import { PrestamoService } from '../../shared/service/prestamo.service';

const LONGITUD_MINIMA_PERMITIDA_CEDULA = 10;
const ERROR_SERVIDOR = 'Se presento un error en el servidor: Codigo ';
const VALIDAR_CAMPOS = 'Debe validar los campos obligatorios.';
const MENSAJE_NO_SUSPENSION = 'La solicitud es vigente, esta a punto de realizar la entrega.';
const MENSAJE_SUSPENSION = 'La fecha de entrega de la solicitud esta fuera de la fecha estipulada, ' +
  'Esto generara una fecha de suspension y un valor el cual debe cancelar ' +
  'la persona que realizo la anterior solicitud consultada, ' +
  'en el momento que se realice la entrega y actualice la solicitud podra ' +
  'visualizar la fecha de suspension y el monto a pagar.';
const MENSAJE_SUSPENSION_CREADA = 'La solicitud es suspendida, debe esperar hasta un dia despues de la ' +
  'fecha que se le indico para poder realizar una nueva solicitud.';


@Component({
  selector: 'app-entregar-prestamo',
  templateUrl: './entregar-prestamo.component.html'
})
export class EntregarPrestamoComponent implements OnInit {

  columns: string[] = ['id', 'cedula', 'equipo', 'fechaCreacion', 'fechaEntrega', 'estado'];
  prestamoFormConsulta: FormGroup;
  prestamo: Prestamo;
  consulta: boolean;
  botonActualizar: boolean;
  mensaje: string;
  estadoActualizacion: number;
  dataSource = [];
  ok: string;
  success: string;
  error: string;


  constructor(protected prestamoService: PrestamoService,
    private notifierService: NotifierService) { }

  ngOnInit() {
    this.construirFormularioConsulta();
    this.inicializarVariables();
  }

  construirFormularioConsulta() {
    this.prestamoFormConsulta = new FormGroup({
      cedulaConsulta: new FormControl('', [Validators.required, Validators.minLength(LONGITUD_MINIMA_PERMITIDA_CEDULA),
      Validators.maxLength(LONGITUD_MINIMA_PERMITIDA_CEDULA)])
    });
  }

  inicializarVariables() {
    this.consulta = false;
    this.botonActualizar = false;
    this.estadoActualizacion = 0;
    this.ok = 'ok';
    this.success = 'success';
    this.error = 'error';
  }

  consultar() {
    if (this.prestamoFormConsulta.status !== 'INVALID') {
      this.consulta = false;
      this.dataSource = [];
      this.consumoConsultarSolicitud(this.prestamoFormConsulta.get('cedulaConsulta').value + '');
    } else {
      this.notifierService.showNotification(VALIDAR_CAMPOS, this.ok, this.error);
    }
  }

  consumoConsultarSolicitud(cedula) {
    this.prestamoService.consultar(cedula)
      .subscribe(solicitud => {
        let respuesta = JSON.parse(JSON.stringify(solicitud));
        this.generarObjetoTabla(respuesta)
        this.validarEstadoSolicitud(respuesta.estado);
        this.validarFechaMensajeSuspension(respuesta.fechaEntrega);
      },
        error => {
          let errorRespuesta = JSON.parse(JSON.stringify(error));
          if (errorRespuesta.error.mensaje !== undefined) {
            this.notifierService.showNotification(errorRespuesta.error.mensaje, this.ok, this.error);
          } else {
            this.notifierService.showNotification(ERROR_SERVIDOR + errorRespuesta.status, this.ok, this.error);
          }
        })
  }

  generarObjetoTabla(respuesta) {
    this.prestamo = new Prestamo(respuesta.id, respuesta.cedula, respuesta.equipoComputo
      , respuesta.fechaCreacion, respuesta.fechaEntrega, respuesta.estado);
    this.dataSource = [this.prestamo];
    this.consulta = true;
  }

  validarEstadoSolicitud(estado) {
    if (estado == 1) {
      this.botonActualizar = true;
    } else {
      this.botonActualizar = false;
    }
  }

  validarFechaMensajeSuspension(fecha) {
    let fechaEntrega = new Date(fecha);
    let fechaActual = new Date;
    if (this.botonActualizar) {
      if (fechaEntrega < fechaActual) {
        this.mensaje = MENSAJE_SUSPENSION;
        this.estadoActualizacion = 2;
      } else {
        this.mensaje = MENSAJE_NO_SUSPENSION;
        this.estadoActualizacion = 0;
      }
    } else {
      this.mensaje = MENSAJE_SUSPENSION_CREADA;
    }
  }

  consumoActualizacion() {
    let prestamoActualizar: Prestamo = new Prestamo(this.prestamo.id,
      this.prestamo.cedula, this.prestamo.equipoComputo, this.prestamo.fechaCreacion,
      this.prestamo.fechaEntrega, this.estadoActualizacion);

    this.prestamoService.actualizar(prestamoActualizar)
      .subscribe(solicitud => {
        let respuesta = JSON.parse(JSON.stringify(solicitud));
        this.notifierService.showNotification(respuesta.valor, this.ok, this.success);
        this.botonActualizar = false;
      },
        error => {
          let errorRespuesta = JSON.parse(JSON.stringify(error));
          if (errorRespuesta.error.mensaje !== undefined) {
            this.notifierService.showNotification(errorRespuesta.error.mensaje, this.ok, this.error);
          } else {
            this.notifierService.showNotification(ERROR_SERVIDOR + errorRespuesta.status, this.ok, this.error);
          }
        })
  }


}

