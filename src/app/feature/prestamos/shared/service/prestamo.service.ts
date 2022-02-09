import { Injectable } from '@angular/core';
import { HttpService } from '@core-service/http.service';
import { environment } from 'src/environments/environment';
import { Prestamo } from '../model/prestamo';


@Injectable()
export class PrestamoService {

  constructor(protected http: HttpService) {}

  public consultar(cedula: string) {
    return this.http.doGet<Prestamo[]>(`${environment.endpoint}/prestamo/${cedula}`, this.http.optsName('consultar prestamo'));
  }

  public guardar(prestamo: Prestamo) {
    return this.http.doPost<Prestamo>(`${environment.endpoint}/prestamo`, prestamo,
                                                this.http.optsName('crear prestamo'));
  }

  public actualizar(prestamo: Prestamo) {
    return this.http.doPut<Prestamo>(`${environment.endpoint}/prestamo`, prestamo,
                                                 this.http.optsName('Actualizar prestamo'));
  }
}
