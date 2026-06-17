import { Routes } from '@angular/router';
import { authGuard } from '../core/guards/auth.guard';

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
  {
    path: 'dashboard',
    loadComponent: () =>
      import('../features/dashboard/pages/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: 'pacientes',
    loadComponent: () =>
      import('../features/pacientes/pages/pacientes.component').then(m => m.PacientesComponent),
    canActivate: [authGuard],
  },
  {
    path: 'pacientes/:id',
    loadComponent: () =>
      import('../features/pacientes/pages/paciente-detalle.component').then(m => m.PacienteDetalleComponent),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];