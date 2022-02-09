import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrearPrestamoComponent } from './components/crear-prestamo/crear-prestamo.component';
import { EntregarPrestamoComponent } from './components/entregar-prestamo/entregar-prestamo.component';
import { PrestamoComponent } from './components/prestamo/prestamo.component';


const routes: Routes = [
  {
    path: '',
    component: PrestamoComponent,
    children: [
      {
        path: 'crear',
        component: CrearPrestamoComponent
      },
      {
        path: 'entregar',
        component: EntregarPrestamoComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrestamosRoutingModule { }
