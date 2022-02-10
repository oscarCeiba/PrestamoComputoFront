import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule, MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpService } from '@core/services/http.service';
import { Prestamo } from '../../shared/model/prestamo';
import { of } from 'rxjs';
import { PrestamoService } from '../../shared/service/prestamo.service';
import { EntregarPrestamoComponent } from './entregar-prestamo.component';


describe('EntregarPrestamoComponent', () => {
  let component: EntregarPrestamoComponent;
  let fixture: ComponentFixture<EntregarPrestamoComponent>;
  const MENSAJE_NO_SUSPENSION = "La solicitud es vigente, esta a punto de realizar la entrega.";
  const MENSAJE_SUSPENSION = "La fecha de entrega de la solicitud esta fuera de la fecha estipulada, " +
    "Esto generara una fecha de suspension y un valor el cual debe cancelar " +
    "la persona que realizo la anterior solicitud consultada, " +
    "en el momento que se realice la entrega y actualice la solicitud podra " +
    "visualizar la fecha de suspension y el monto a pagar.";
  const MENSAJE_SUSPENSION_CREADA = "La solicitud es suspendida, debe esperar hasta un dia despues de la " +
    "fecha que se le indico para poder realizar una nueva solicitud.";
  let prestamoService: PrestamoService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EntregarPrestamoComponent],
      imports: [MatSnackBarModule,
        BrowserAnimationsModule],
      providers: [PrestamoService,
        HttpService,
        HttpClient,
        HttpHandler,
        { provide: MAT_SNACK_BAR_DATA, useValue: {} },
        { provide: MatSnackBarRef, useValue: {} }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntregarPrestamoComponent);
    component = fixture.componentInstance;
    prestamoService = TestBed.inject(PrestamoService);
    fixture.detectChanges();
  });

  it('componente creado', () => {
    expect(component).toBeTruthy();
  });

  it('formulario es invalido cuando esta vacio', () => {
    expect(component.prestamoFormConsulta.valid).toBeFalsy();
  });

  it('formulario es invalido cuando esta vacio haciendo click al boton consultar', () => {
    component.prestamoFormConsulta.controls.cedulaConsulta.setValue('');

    component.consultar();

    expect(component.prestamoFormConsulta.valid).toBeFalsy();
  });

  it('formulario valido cuando esta vacio haciendo click al boton consultar', () => {
    const respuesta : [Prestamo] = [new Prestamo(1,1023009035,"Dell","2021-11-01","2021-11-15",1)];
    component.prestamoFormConsulta.controls.cedulaConsulta.setValue('1023009044');
    spyOn(prestamoService, 'consultar').and.returnValue(
      of(respuesta)
    );

    component.consultar();

    expect(component.prestamoFormConsulta.valid).toBeTrue();
  });

  it('formulario valido cuando esta vacio haciendo click al boton consultar error servicio', () => {
    const respuesta : [Prestamo] = [new Prestamo(1,1023009035,"Dell","2021-11-01","2021-11-15",1)];
    component.prestamoFormConsulta.controls.cedulaConsulta.setValue('1023009044');
    

    component.consultar();

    spyOn(prestamoService, 'consultar').and.returnValue(
      of(respuesta)
    );

    expect(component.prestamoFormConsulta.valid).toBeTrue();
  });

  it('prueba validar metodo estado solicitud con 1', () => {
    component.botonActualizar = false;

    component.validarEstadoSolicitud(1);

    expect(component.botonActualizar).toBeTrue();
  });

  it('prueba validar metodo estado solicitud con 2', () => {
    component.botonActualizar = false;

    component.validarEstadoSolicitud(2);

    expect(component.botonActualizar).toBeFalse();
  });

  it('prueba validar metodo fecha mensaje solicitud mensaje suspension', () => {
    component.botonActualizar = true;

    component.validarFechaMensajeSuspension("2021-11-01");

    expect(component.mensaje).toEqual(MENSAJE_SUSPENSION);
  });

  it('prueba validar metodo fecha mensaje solicitud mensaje de no suspension', () => {
    component.botonActualizar = true;

    component.validarFechaMensajeSuspension("2022-03-01");

    expect(component.mensaje).toEqual(MENSAJE_NO_SUSPENSION);
  });

  it('prueba validar metodo fecha mensaje solicitud mensaje de suspension creada', () => {
    component.botonActualizar = false;

    component.validarFechaMensajeSuspension("2022-03-01");

    expect(component.mensaje).toEqual(MENSAJE_SUSPENSION_CREADA);
  });

  it('prueba validar metodo generar objeto tabla', () => {
    const respuesta : Prestamo = new Prestamo(1,1023009044,"Dell","2021-11-01","2021-11-15",2);

    component.generarObjetoTabla(respuesta);

    expect(component.consulta).toBeTrue();
  });

  it('prueba validar metodo actualizar', () => {
    const respuesta = {"valor":""};
    component.prestamo = new Prestamo(1,1023009035,"Dell","2022-02-01","2022-02-30",1);
    component.estadoActualizacion = 0;
    spyOn(prestamoService, 'actualizar').and.returnValue(
      of(respuesta)
    );
      
    component.consumoActualizacion();

    expect(component.botonActualizar).toBeFalse();
  });

});
