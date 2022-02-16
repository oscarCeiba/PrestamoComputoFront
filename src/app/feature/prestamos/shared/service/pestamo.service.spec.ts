import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


import { environment } from 'src/environments/environment';
import { HttpService } from 'src/app/core/services/http.service';

import { HttpResponse } from '@angular/common/http';
import { PrestamoService } from './prestamo.service';
import { Prestamo } from '../model/prestamo';

describe('ProductoService', () => {
  let httpMock: HttpTestingController;
  let service: PrestamoService;
  const apiEndpointPrestamos = `${environment.endpoint}/prestamo`;
  const apiEndpointPrestamoConsulta = `${environment.endpoint}/prestamo/`;
  const apiEndpointPrestamoActualizar = `${environment.endpoint}/prestamo`;


  beforeEach(() => {
    const injector = TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PrestamoService, HttpService]
    });
    httpMock = injector.inject(HttpTestingController);
    service = TestBed.inject(PrestamoService);
  });

  it('should be created', () => {
    const prestamoService: PrestamoService = TestBed.inject(PrestamoService);
    expect(prestamoService).toBeTruthy();
  });

  it('deberia crear un prestamo', () => {
    const dummyPrestamo = new Prestamo(null, 1023009035, 'Asus1', '2022-02-04', null, null);
    service.guardar(dummyPrestamo).subscribe((respuesta) => {
      expect(respuesta).toEqual(Object);
    });
    const req = httpMock.expectOne(apiEndpointPrestamos);
    expect(req.request.method).toBe('POST');
    req.event(new HttpResponse<object>({body: Object}));
  });

  it('deberia listar prestamo', () => {
    const dummyPrestamo =  [new Prestamo(1, 1023009044, 'Dell', '2021-11-01', '2021-11-15', 2)];
    service.consultar('1023009044').subscribe(prestamo => {
      expect(prestamo).toEqual(dummyPrestamo);
    });
    const req = httpMock.expectOne(apiEndpointPrestamoConsulta + '1023009044');
    expect(req.request.method).toBe('GET');
    req.flush(dummyPrestamo);
  });

  it('deberia Actualizar prestamo', () => {
    const dummyPrestamo = new Prestamo(1, 1023009044, 'Dell', '2021-11-01', '2021-11-15', 0);
    service.actualizar(dummyPrestamo).subscribe(prestamo => {
      expect(prestamo).toEqual(Object);
    });
    const req = httpMock.expectOne(apiEndpointPrestamoActualizar);
    expect(req.request.method).toBe('PUT');
    req.event(new HttpResponse<object>({body: Object}));
  });

});
