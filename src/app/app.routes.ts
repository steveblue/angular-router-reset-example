import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './shared/components/home/home.component';

const routes: Routes = [
  { path: '',
    component: HomeComponent,
    children: [{ path: 'lazy', loadChildren: 'shared/components/lazy/lazy.module#LazyModule' }] },
];

console.log('ORIGINAL ROUTE CONFIG', routes);

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);