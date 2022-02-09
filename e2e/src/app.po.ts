import { browser, by, element } from 'protractor';

export class AppPage {
  navigateTo() {
    return browser.get(browser.baseUrl) as Promise<any>;
  }

  getText(valor: string){
    return element(by.css(valor)).getText() as Promise<string>;
  }
}
