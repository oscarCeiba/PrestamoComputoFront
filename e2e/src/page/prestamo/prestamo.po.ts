import { by, element } from 'protractor';

export class PrestamoPage {
    private linkCrearPrestamo = element(by.id('mat-tab-label-0-0'));
    private linkActualizarPrestamo = element(by.id('mat-tab-label-0-1'));
    private inputCedula = element(by.id('idCedula'));
    private inputCedulaConsulta = element(by.id('idCedulaConsulta'));
    private inputEquipoComputo = element(by.id('idEquipoComputo'));
    private buttonCrear = element(by.id('crearSolicitud'));
    private buttonConsultar = element(by.id('consultarSolicitud'));
    private buttonActualizar = element(by.id('actualizarSolicitud'));

    async clickBotonCrearPrestamo() {
        await this.linkCrearPrestamo.click();
    }

    async clickBotonActualizarPrestamo() {
        await this.linkActualizarPrestamo.click();
    }

    async ingresarCedula(Cedula) {
        await this.inputCedula.sendKeys(Cedula);
    }

    async ingresarCedulaConsulta(Cedula) {
        await this.inputCedulaConsulta.sendKeys(Cedula);
    }

    async ingresarEquipoComputo(EquipoComputo) {
        await this.inputEquipoComputo.sendKeys(EquipoComputo);
    }

    async clickBotonCrear(){
        await this.buttonCrear.click();
    }

    async clickBotonConsultar(){
        await this.buttonConsultar.click();
    }

    async clickBotonActualizar(){
         await this.buttonActualizar.click();
    } 

}
