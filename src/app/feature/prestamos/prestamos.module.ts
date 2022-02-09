import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { PrestamosRoutingModule } from './prestamos-routing.module';
import { CrearPrestamoComponent } from './components/crear-prestamo/crear-prestamo.component';
import { EntregarPrestamoComponent } from './components/entregar-prestamo/entregar-prestamo.component';
import { PrestamoComponent } from './components/prestamo/prestamo.component';
import { SharedModule } from '@shared/shared.module';
import { CoreModule } from '@core/core.module';
import { PrestamoService } from './shared/service/prestamo.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';





@NgModule({
  declarations: [
    CrearPrestamoComponent,
    EntregarPrestamoComponent,
    PrestamoComponent
  ],
  imports: [
    PrestamosRoutingModule,
    SharedModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [PrestamoService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PrestamosModule { }
