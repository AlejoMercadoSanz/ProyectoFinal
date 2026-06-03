import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('../features/auth/login/pages/login.component').then(m => m.LoginComponent),
  },
//   {
//     path: 'dashboard',
//     // TODO
//     loadComponent: () =>
//       import('../features/dashboard/dashboard.component').then(m => m.DashboardComponent),
//     // canActivate: [authGuard],
//   },
  {
    path: '**',
    redirectTo: 'login',
  },
];