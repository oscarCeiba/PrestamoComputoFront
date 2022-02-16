import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

export interface Options {
  headers?: HttpHeaders;
  params?: HttpParams;
}
@Injectable()
export class HttpService {

  constructor(protected http: HttpClient) { }

  public createDefaultOptions(): Options {
    return {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  }

  public optsName(name: string): Options {
    return this.setHeader('xhr-name', name);
  }

  private setHeader(name: string, value: string) {
    const newopts = this.createDefaultOptions();
    newopts.headers = newopts.headers.set(name, value);
    return newopts;
  }

  private createOptions(opts: Options): Options {
    const defaultOpts: Options = this.createDefaultOptions();

    if (opts) {
      opts = {
        params: opts.params || defaultOpts.params,
        headers: opts.headers || defaultOpts.headers
      };

      if (!opts.headers.get('Content-Type')) {
        opts.headers = opts.headers.set('Content-Type', defaultOpts.headers.get('Content-Type'));
      }
    }

    return opts || defaultOpts;
  }


  public doGet<T>(serviceUrl: string, opts?: Options): Observable<T> {
    const ropts = this.createOptions(opts);
    return this.http.get<T>(serviceUrl, ropts);
  }

  public doPost<a>(serviceUrl: string, body: a, opts?: Options): Observable<object> {
    const ropts = this.createOptions(opts);

    return this.http.post(serviceUrl, body, ropts);
  }

  public doPut<a>(serviceUrl: string, body: a, opts?: Options): Observable<object> {
    const ropts = this.createOptions(opts);

    return this.http.put(serviceUrl, body, ropts);
  }
}
