import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule, MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NotifierService } from '@core/components/notifier/notifier.service';
import { HttpService } from '@core/services/http.service';
import { of, throwError } from 'rxjs';
import { Prestamo } from '../../shared/model/prestamo';
import { PrestamoService } from '../../shared/service/prestamo.service';


import { CrearPrestamoComponent } from './crear-prestamo.component';

describe('CrearPrestamoComponent', () => {
  let component: CrearPrestamoComponent;
  let fixture: ComponentFixture<CrearPrestamoComponent>;
  let prestamoService: PrestamoService;
  let notifierService: NotifierService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrearPrestamoComponent],
      imports: [
        CommonModule,
        HttpClientModule,
        RouterTestingModule,
        ReactiveFormsModule,
        FormsModule,
        MatSnackBarModule,
        BrowserAnimationsModule
      ],
      providers: [PrestamoService,
        HttpService,
        { provide: MAT_SNACK_BAR_DATA, useValue: {} },
        { provide: MatSnackBarRef, useValue: {} }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearPrestamoComponent);
    component = fixture.componentInstance;
    prestamoService = TestBed.inject(PrestamoService);
    notifierService = TestBed.inject(NotifierService);
    fixture.detectChanges();
  });

  it('componente creado', () => {
    expect(component).toBeTruthy();
  });

  it('formulario es invalido cuando esta vacio', () => {
    const fechaActual = new Date();
    const UNO = 1;
    const NUEVE = 9;
    const anualidad = fechaActual.getFullYear();
    const mes = ((fechaActual.getMonth() + UNO) > NUEVE ? (fechaActual.getMonth() + UNO) : `0${(fechaActual.getMonth() + UNO)}`);
    const dia = (fechaActual.getDate() > NUEVE ? fechaActual.getDate() : `0${fechaActual.getDate()}`);
    const fechaActualVista = `${anualidad}-${mes}-${dia}`;

    expect(component.ok).toEqual('ok');
    expect(component.success).toEqual('success');
    expect(component.error).toEqual('error');
    expect(component.fechaActualVista).toEqual(fechaActualVista);
    expect(component.prestamoForm.valid).toBeFalsy();
  });

  it('campos formulario', () => {
    let cedula = component.prestamoForm.controls['cedula'];
    let equipoComputo = component.prestamoForm.controls['equipoComputo'];
    expect(cedula.valid).toBeFalsy();
    expect(equipoComputo.valid).toBeFalsy();
  });

  it('Registrando prestamo sin valores completos', () => {
    const VALIDAR_CAMPOS = 'Debe validar los campos obligatorios.'
    component.prestamoForm.controls.cedula.setValue('');
    component.prestamoForm.controls.equipoComputo.setValue('A');
    let spy = spyOn(notifierService, 'showNotification');

    component.cerrar();

    expect(component.prestamoForm.valid).toBeFalsy();
    expect(component.prestamoForm.status).toEqual('INVALID');
    expect(spy).toHaveBeenCalledWith(VALIDAR_CAMPOS, 'ok', 'error');
  });


  it('Registrando prestamo con valores completos, error servicio con mensaje', fakeAsync(() => {
    const ERROR = { status: 404,error:{mensaje:'error'} };
    // decirle al espía que devuelva un error observable
    spyOn(prestamoService, 'guardar').and.returnValue(throwError(ERROR));
    let spyNotificaciones = spyOn(notifierService, 'showNotification');
    component.consumoGuardarSolicitud();
    fixture.detectChanges();  // actualiza errorMessage dentro de setTimeout ()
    expect(spyNotificaciones).toHaveBeenCalledWith('error', 'ok', 'error');
  }));

  it('Registrando prestamo con valores completos, error servicio sin mensaje', fakeAsync(() => {
    const ERROR = { status: 404,error:{mensaje:undefined}};
    const ERROR_SERVIDOR = 'Se presento un error en el servidor: Codigo ';
    spyOn(prestamoService, 'guardar').and.returnValue(throwError(ERROR));
    let spyNotificaciones = spyOn(notifierService, 'showNotification');
    component.consumoGuardarSolicitud();
    fixture.detectChanges();  
    expect(spyNotificaciones).toHaveBeenCalledWith(ERROR_SERVIDOR + 404, 'ok', 'error');
  }));

  it('Registrando prestamo con valores completos', () => {
    const respuesta = { valor: 'prueba' };
    let prestamo = new Prestamo(null, component.prestamoForm.controls.cedula.value,
      component.prestamoForm.controls.equipoComputo.value, '2022-02-17', null, null);
    component.prestamoForm.controls.cedula.setValue('1023009035');
    component.prestamoForm.controls.equipoComputo.setValue('Asus1');
    let spy = spyOn(notifierService, 'showNotification');
    spyOn(prestamoService, 'guardar').and.callFake(() => {
      return of(respuesta);
    });

    component.cerrar();

    expect(component.prestamoForm.valid).toBeTrue();
    prestamoService.guardar(prestamo).subscribe(
      (solicitud) => {
        expect(prestamoService.guardar).toHaveBeenCalled(); // check if executed
        expect(solicitud).toBe(respuesta);
        expect(spy).toHaveBeenCalledWith(respuesta.valor, 'ok', 'success');
      });
  });

});
