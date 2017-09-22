import { Component } from '@angular/core';
import { Router, Routes } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { HomeComponent } from './shared/components/home/home.component';

@Component({
    moduleId: module.id,
    selector: 'cmp-prefix1-app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css']
})


export class AppComponent {

    routes: Routes[]

    constructor(private router: Router,
                private http: Http) {
                    this.getRoutes().subscribe();
    }

    getRoutes(): Observable<Routes[]> {

        return this.http.get('/data/routes.model.json')
            .map((res: Response) => {

                let routes: Routes = [
                    { path: '', component: HomeComponent }
                ];
                routes = routes.concat(res.json());
                console.log(routes);
                this.router.resetConfig(routes);

            })
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));

    }

}
