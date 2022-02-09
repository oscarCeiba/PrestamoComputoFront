import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule, MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NotifierService } from '@core/components/notifier/notifier.service';
import { HttpService } from '@core/services/http.service';
import { of } from 'rxjs';
import { PrestamoService } from '../../shared/service/prestamo.service';


import { CrearPrestamoComponent } from './crear-prestamo.component';

describe('CrearPrestamoComponent', () => {
  let component: CrearPrestamoComponent;
  let fixture: ComponentFixture<CrearPrestamoComponent>;
  let prestamoService: PrestamoService;
  let respuesta: { valor: 'prueba' };
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
    expect(component.prestamoForm.valid).toBeFalsy();
  });

  it('Registrando prestamo sin valores completos', () => {
    component.prestamoForm.controls.cedula.setValue('1023009035');
    component.prestamoForm.controls.equipoComputo.setValue('A');

    component.cerrar();

    expect(component.prestamoForm.valid).toBeFalsy();
  });

  it('Registrando prestamo con valores completos y error servicio', () => {
    component.prestamoForm.controls.cedula.setValue('1023009035');
    component.prestamoForm.controls.equipoComputo.setValue('Asus1');

    component.cerrar();
    spyOn(prestamoService, 'guardar').and.returnValue(
      of(respuesta)
    );
    spyOn(notifierService,'showNotification');

    expect(component.prestamoForm.valid).toBeTrue();
   
  });

  it('Registrando prestamo con valores completos', () => {
    component.prestamoForm.controls.cedula.setValue('1023009035');
    component.prestamoForm.controls.equipoComputo.setValue('Asus1');
    spyOn(prestamoService, 'guardar').and.returnValue(
      of(respuesta)
    );
    

    component.cerrar();

    expect(component.prestamoForm.valid).toBeTrue();
    expect(component.respuesta).toEqual(respuesta);
  });

});
