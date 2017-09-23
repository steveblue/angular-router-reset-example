import { Inject, Injectable, Injector } from '@angular/core';
import { Router, Routes, Route } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

import { HomeComponent } from './shared/components/home/home.component';

@Injectable()
export class AppConfig {


    constructor(private injector: Injector,
                private http: Http) {

    }

    public load() {

        console.warn('NEW ROUTE CONFIG IS LOADING...');

        return new Promise((resolve, reject) => {

            this.http.get('/data/routes.model.json').toPromise().then((res) => {

                let routerConfig = res.json();

                let routes: Routes = [
                    { path: '', component: HomeComponent, children: routerConfig['routes'] }
                ];

                console.log('INJECTING NEW CONFIG VIA Injector.get(Router).resetConfig(routes):', routes);

                this.injector.get(Router).resetConfig(routes);

                resolve(routes);

            })

        });

    }
}