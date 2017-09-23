#Lazyloading Routes with ClosureCompiler

In this example a JSON config sets the routes of the main application bundle with `Router.resetConfig(routes)`. The build generates a lazyloaded bundle that should be navigatable by visiting

http://localhost:4200/lazy
http://localhost:4200/lazy1
http://localhost:4200/lazy2
http://localhost:4200/lazy3
http://localhost:4200/lazy4

The app is bundled for production using ClosureCompiler in `ADVANCED_OPTIMIZATIONS` mode.


```
npm i -g angular-rollup rimraf
npm install
ngr build prod --closure --lazy --serve
```


app.module.ts

```
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { AppConfig } from './app.config';

export function initConfig(config: AppConfig) {
    return () => config.load()
}


@NgModule({

    imports: [ BrowserModule,
               BrowserAnimationsModule,
               HttpModule,
               CommonModule,
               FormsModule,
               HomeModule,
               routing],
    declarations: [ AppComponent ],
    bootstrap:    [ AppComponent ],
    providers: [AppConfig, { provide: APP_INITIALIZER, useFactory: initConfig, deps: [AppConfig], multi: true }]
})

export class AppModule {}

```

Routes need to be dynamically configured before the app bootstraps. We can achieve this using the APP_INITIALIZER and a custom AppConfig @Injectable. We call AppConfig.load() via the AppModule.


app.config.ts


```
    public load() {

        console.warn('NEW ROUTE CONFIG IS LOADING...');

        return new Promise((resolve, reject) => {

            this.http.get('/data/routes.model.json').toPromise().then((res) => {

                let routerConfig = res.json();

                let routes: Routes = [
                    { path: '', component: HomeComponent, children: [] }
                ];

                routerConfig['routes'].forEach((route: Route) => {
                    routes[0].children.push({ path: route['path'], loadChildren: route['loadChildren'] });
                });

                console.log('INJECTING NEW CONFIG VIA Injector.get(Router).resetConfig(routes):', routes);

                this.injector.get(Router).resetConfig(routes);

                resolve(routes);

            })

        });

    }

```

The load method uses Http to request a JSON configuration file. The JSON is parsed and added to the root Route children Array. We need to push to the Array so ClosureCompiler can map the JSON properties to props on the Route in ADVANCED_OPTIMIZATIONS mode. Finally, we call `resetConfig(routes)` on the Router. 4 new routes are added to the config in this example, but this could scale to an entire sitemap.

