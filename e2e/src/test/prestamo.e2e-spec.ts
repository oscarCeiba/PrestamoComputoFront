import { NavbarPage } from '../page/navbar/navbar.po';
import { AppPage } from '../app.po';
import { PrestamoPage } from '../page/prestamo/prestamo.po';
import { browser } from 'protractor';

describe('workspace-project Prestamo', () => {
    let page: AppPage;
    let navBar: NavbarPage;
    let prestamo: PrestamoPage;

    beforeEach(() => {
        page = new AppPage();
        navBar = new NavbarPage();
        prestamo = new PrestamoPage();
    });

    it('Deberia crear prestamo', () => {
        const CEDULA = '1023009035';
        const EQUIPOCOMPUTO = 'Asus123';

        page.navigateTo();
        navBar.clickBotonPrestamos();
        prestamo.clickBotonCrearPrestamo();
        prestamo.ingresarCedula(CEDULA);
        prestamo.ingresarEquipoComputo(EQUIPOCOMPUTO);
        prestamo.clickBotonCrear();

        expect(page.getText('app-notifier h2')).toEqual('success');
    });

    it('No deberia crear prestamo', () => {
        const CEDULA = '1023009035';
        const EQUIPOCOMPUTO = 'Asus123';

        page.navigateTo();
        navBar.clickBotonPrestamos();
        prestamo.clickBotonCrearPrestamo();
        prestamo.ingresarCedula(CEDULA);
        prestamo.ingresarEquipoComputo(EQUIPOCOMPUTO);
        prestamo.clickBotonCrear();

        expect(page.getText('app-notifier h2')).toEqual('error');
    });

    it('Deberia consultar prestamo', () => {
        const CEDULA = '1023009035';

        page.navigateTo();
        navBar.clickBotonPrestamos();
        prestamo.clickBotonActualizarPrestamo();
        prestamo.ingresarCedulaConsulta(CEDULA);
        prestamo.clickBotonConsultar();

        expect(page.getText('app-root td')).toEqual('5');
    });

    it('Deberia consultar prestamo y actualizar la solicitud', () => {
        const CEDULA = '1023009035';

        page.navigateTo();
        navBar.clickBotonPrestamos();
        prestamo.clickBotonActualizarPrestamo();
        prestamo.ingresarCedulaConsulta(CEDULA);
        prestamo.clickBotonConsultar();
        browser.sleep(1000);
        prestamo.clickBotonActualizar();

        expect(page.getText('app-notifier h2')).toEqual('success');
    });

});
