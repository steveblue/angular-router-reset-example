#Lazyloading Routes with ClosureCompiler

In this example a JSON config sets the routes of the main application bundle with `Router.resetConfig(routes)`. The build generates a lazyloaded bundle that should be navigatable by visiting

http://localhost:4200/lazy
http://localhost:4200/lazy1
http://localhost:4200/lazy2
http://localhost:4200/lazy3
http://localhost:4200/lazy4

The configured Routes work in JIT, AOT Compiled and bundled with `SIMPLE_OPTIMIZATIONS` but fail with `ADVANCED_OPTIMIZATIONS`. I am wondering if this is an issue with tsickle?

If you change `closure.conf` and `closure.lazy.conf` to SIMPLE_OPTIMIZATIONS the app will load every Route. Click on the logo to go back to / on a /lazy route. The Routes all load the same child.


```
npm i -g angular-rollup rimraf
npm install
ngr build prod --closure --lazy --serve
```

Observe in browser console when compiled with `ADVANCED_OPTIMIZATIONS`, loadChildren is not mangled correctly when Routes are updated with resetConfig(), but other properties on the Routes model are.


THIS WORKS:

```

    const routes: Routes = [
    { path: '',
        component: HomeComponent,
        children: [{ path: 'lazy', loadChildren: 'shared/components/lazy/lazy.module#LazyModule' }] },
    ];

    console.log('ORIGINAL ROUTE CONFIG', routes);

    export const routing: ModuleWithProviders = RouterModule.forRoot(routes);

```

^ In above example ClosureCompiler correctly mangles all properties. `children` is not mangled, but `loadChildren` is.


THIS DOESNT:


```

    console.warn('NEW ROUTE CONFIG IS LOADING');

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



```

^ In this example ClosureCompiler correctly mangles all properties except loadChildren. `children` is not mangled, and `loadChildren` is not mangled either.

RESULTS IN THE FOLLOWING ERROR:

```
ERROR Error: Uncaught (in promise): Error: Invalid configuration of route 'lazy1'. One of the following must be provided: component, redirectTo, children or loadChildren
Error: Invalid configuration of route 'lazy1'. One of the following must be provided: component, redirectTo, children or loadChildren
```



